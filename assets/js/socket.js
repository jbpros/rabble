import { Socket } from 'phoenix'
import Vue from 'vue'
import Vuex from 'vuex'
import ChatInput from './components/chat-input.vue'
import ConnectionStatus from './components/connection-status.vue'
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

const Messages = {
  template: `<ul>
      <li v-for="message in messages"><strong>{{ message.nickname}}:</strong> {{ message.body }}</li>
    </ul>`,
  computed: {
    messages() {
      return this.$store.getters.messages
    },
  },
}

const Chat = {
  template: `<div>
      <messages></messages>
      <chat-input v-bind:channel="channel"></chat-input>
    </div>`,
  components: {
    ChatInput,
    Messages,
  },
  props: { channel: { type: Object } },
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    channel: null,
    messages: [],
  },
  getters: {
    isConnected(state) {
      return !!state.channel
    },
    messages(state) {
      return state.messages
    },
  },
  mutations: {
    setChannel(state, { channel }) {
      state.channel = channel
    },
    storeMessage(state, { payload }) {
      state.messages.push(payload)
    },
  },
  actions: {
    connect({ commit }, { channel }) {
      commit('setChannel', { channel })
    },
    receiveNewMessage({ commit }, { payload }) {
      commit('storeMessage', { payload })
    },
  },
})

new Vue({
  el: '#main',
  components: { Chat, ConnectionStatus },
  data: { channel },
  store,
})

channel.on('new_msg', payload =>
  store.dispatch('receiveNewMessage', { payload })
)

channel
  .join()
  .receive('ok', resp => {
    store.dispatch('connect', { channel, resp })
  })
  .receive('error', resp => {
    store.dispatch('connection failure', { channel, resp })
  })

export default socket
