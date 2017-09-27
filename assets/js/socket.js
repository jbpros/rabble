import { Socket } from 'phoenix'
import Vue from 'vue/dist/vue.common'

const socket = new Socket('/socket', {
  params: { token: window.userToken, nickname: 'jbpros' },
})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

const channel = socket.channel('room:lobby', {})

const state = {
  connection: {
    status: 'Unknown',
    resp: null,
  },
  messages: [],
}

Vue.component('connection-status', {
  template: `<div>
      {{ status }} (<code>{{ JSON.stringify(resp) }}</code>)
    </div>`,
  data: function() {
    return state.connection
  },
})

Vue.component('messages', {
  template: `<ul>
      <li v-for="message in messages"><strong>{{ message.nickname}}:</strong> {{ message.body }}</li>
    </ul>`,
  data: function() {
    return { messages: state.messages }
  },
})

Vue.component('chat-input', {
  template: `<form id="chat-input" v-on:submit.prevent="send">
      <input v-model="text" placeholder="Your comment..."></input>
      <button type="submit">Send</button>
    </form>`,
  data: function() {
    return { text: '' }
  },
  methods: {
    send: function() {
      channel.push('new_msg', { body: this.text })
      this.text = ''
    },
  },
})

Vue.component('chat', {
  template: `<div>
      <messages></messages>
      <chat-input></chat-input>
    </div>`,
})

new Vue({
  el: '#main',
})

channel.on('new_msg', payload => state.messages.push(payload))

channel
  .join()
  .receive('ok', resp => {
    state.connection.status = 'connected'
    state.connection.resp = resp
  })
  .receive('error', resp => {
    state.connection.status = 'failed'
    state.connection.resp = resp
  })

export default socket
