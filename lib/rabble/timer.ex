defmodule Rabble.Timer do
  use GenServer

  def start_timer(pid, duration_seconds) do
    end_time = DateTime.from_unix!(DateTime.to_unix(DateTime.utc_now()) + duration_seconds)
    GenServer.cast(pid, {:start_timer, end_time})
    RabbleWeb.Endpoint.broadcast "room:lobby", "timer_running", %{"end_time" => end_time}
  end

  def get_current_timer(pid) do
    GenServer.call(pid, {:get_current_timer})
  end

  def start_link() do
    GenServer.start_link(__MODULE__, %{ end_time: nil }, name: Rabble.Timer)
  end

  def init() do
    {:ok, %{}}
  end

  def handle_cast({:start_timer, end_time}, timer) do
    {:noreply, %{ end_time: end_time }}
  end

  def handle_call({:get_current_timer}, _from, timer) do
    {:reply, timer, timer}
  end
end
