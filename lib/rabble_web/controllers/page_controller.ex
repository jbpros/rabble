defmodule RabbleWeb.PageController do
  use RabbleWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
