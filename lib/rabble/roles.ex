defmodule Rabble.Roles do
  use GenServer

  def assign_role(pid, email, role) do
    GenServer.cast(pid, {:assign_role, email, role})
    RabbleWeb.Endpoint.broadcast "room:lobby", "assign_role", %{"email" => email, "role" => role}
  end

  def get_roles(pid) do
    GenServer.call(pid, {:get_roles})
  end

  def get_role_assignee(pid, role) do
    GenServer.call(pid, {:get_role_assignee, role})
  end

  def start_link() do
    GenServer.start_link(__MODULE__, %{}, name: Rabble.Roles)
  end

  def init() do
    {:ok, %{}}
  end

  def handle_cast({:assign_role, email, role}, roles) do
    IO.inspect(roles)
    {:noreply, Map.put(roles, role, email)}
  end

  def handle_call({:get_roles}, _from, roles) do
    {:reply, roles, roles}
  end

  def handle_call({:get_role_assignee, role}, _from, roles) do
    {:reply, roles[role], roles}
  end
end
