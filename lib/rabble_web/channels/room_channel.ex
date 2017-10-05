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
      Presence.update(socket, socket.assigns.nickname, %{status_emoji: msg.status_emoji})
    end
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.nickname, %{
      online_at: inspect(System.system_time(:seconds)),
      status_emoji: ""
    })
    {:noreply, socket}
  end
end
