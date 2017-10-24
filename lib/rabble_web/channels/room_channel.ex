defmodule RabbleWeb.RoomChannel do
  use Phoenix.Channel
  alias Rabble.Presence
  alias Rabble.Roles
  alias Rabble.Timer

  intercept(["_reflect_emoji"])

  def join("room:lobby", _message, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("assign_role", %{"role" => role, "email" => email}, socket) do
    Roles.assign_role(Rabble.Roles, email, role)
    {:noreply, socket}
  end

  def handle_in("unassign_role", %{"role" => role}, socket) do
    Roles.unassign_role(Rabble.Roles, role)
    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{body: body, email: socket.assigns.email}
    {:noreply, socket}
  end

  def handle_in("set_status_emoji", %{"emoji" => emoji}, socket) do
    broadcast! socket, "_reflect_emoji", %{status_emoji: emoji, email: socket.assigns.email}
    {:noreply, socket}
  end

  def handle_in("start_timer", %{"duration_seconds" => duration_seconds}, socket) do
    Rabble.Timer.start_timer(Rabble.Timer, duration_seconds)
    {:noreply, socket}
  end

  def handle_out("_reflect_emoji", msg, socket) do
    if socket.assigns.email == msg.email do
      current_meta = get_presence_meta(socket)
      Presence.update(socket, socket.assigns.email, %{ current_meta |
        status_emoji: msg.status_emoji
      })
    end
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    Roles.assign_role(Rabble.Roles, socket.assigns.email, "newcomer")
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.email, init_meta(socket))
    push socket, "all_roles", Roles.get_roles(Roles)
    push socket, "timer_running", Timer.get_current_timer(Timer)
    {:noreply, socket}
  end

  defp init_meta(socket) do
    %{
      channel_pid: inspect(socket.channel_pid),
      online_at: socket.assigns.online_at,
      status_emoji: %{native: "🕶"} # TODO: nil
    }
  end

  defp get_presence_meta(socket) do
    Enum.find(Presence.list(socket)[socket.assigns.email].metas, fn(meta) ->
      meta.channel_pid == inspect(socket.channel_pid)
    end)
  end
end
