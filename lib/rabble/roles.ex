defmodule Rabble.Roles do
  use GenServer

  def assign_role(pid, nickname, role) do
    GenServer.cast(pid, {:assign_role, nickname, role})
  end

  def get_role_assignee(pid, role) do
    GenServer.call(pid, {:get_role_assignee, role})
  end

  def start_link() do
    GenServer.start_link(__MODULE__, %{})
  end

  def init() do
    {:ok, %{}}
  end

  def handle_cast({:assign_role, nickname, role}, roles) do
    IO.inspect(roles)
    {:noreply, Map.put(roles, role, nickname)}
  end

  def handle_call({:get_role_assignee, role}, _from, roles) do
    {:reply, roles[role], roles}
  end
end
