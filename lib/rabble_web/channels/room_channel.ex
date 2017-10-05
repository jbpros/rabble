defmodule RabbleWeb.RoomChannel do
  use Phoenix.Channel
  alias Rabble.Presence

  intercept(["_reflect_emoji"])

  def join("room:lobby", _message, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{body: body, nickname: socket.assigns.nickname}
    {:noreply, socket}
  end

  def handle_in("set_status_emoji", %{"emoji" => emoji}, socket) do
    broadcast! socket, "_reflect_emoji", %{status_emoji: emoji, nickname: socket.assigns.nickname}
    {:noreply, socket}
  end

  def handle_out("_reflect_emoji", msg, socket) do
    if socket.assigns.nickname == msg.nickname do
      current_meta = get_presence_meta(socket)
      Presence.update(socket, socket.assigns.nickname, %{ current_meta |
        status_emoji: msg.status_emoji
      })
    end
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.nickname, init_meta(socket))
    {:noreply, socket}
  end

  defp init_meta(socket) do
    %{
      channel_pid: inspect(socket.channel_pid),
      online_at: socket.assigns.online_at,
      status_emoji: ""
    }
  end

  defp get_presence_meta(socket) do
    Enum.find(Presence.list(socket)[socket.assigns.nickname].metas, fn(meta) ->
      meta.channel_pid == inspect(socket.channel_pid)
    end)
  end
end
