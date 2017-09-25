# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :rabble,
  ecto_repos: [Rabble.Repo]

# Configures the endpoint
config :rabble, RabbleWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "B+YjA9aoLnFMIEIwG4TnHgisBKK1phCdCHKy1cQLAbawcW3h7CaXV9EOErjhHaQH",
  render_errors: [view: RabbleWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Rabble.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
