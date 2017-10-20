import Vue from 'vue'
import Vuex from 'vuex'
import connectSocket from '../lib/connect_socket'

Vue.use(Vuex)

const presenceToParticipant = (email, presence) => ({
  email,
  statusEmoji: presence.metas[0].status_emoji,
})

export default new Vuex.Store({
  state: {
    channel: null,
    isConnecting: false,
    messages: [],
    email: localStorage.getItem('rabble.email') || '',
    presences: {},
    roles: {},
    status: { emoji: null },
  },
  getters: {
    channel(state) {
      return state.channel
    },
    isConnected(state) {
      return !!state.channel
    },
    isConnecting(state) {
      return state.isConnecting
    },
    messages(state) {
      return state.messages
    },
    email(state) {
      return state.email
    },
    participants(state) {
      return Object.keys(state.presences).map(email =>
        presenceToParticipant(email, state.presences[email])
      )
    },
    roleAssigneeEmails(state) {
      return state.roles
    },
    me(state, getters) {
      return getters.participants.find(p => p.email === getters.email)
    },
  },
  mutations: {
    assignRole(state, { role, email }) {
      state.roles[role] = email
    },
    failToConnect(state, { resp }) {
      state.isConnecting = false
      alert(`Failed to connect (${JSON.stringify(resp)})`)
    },
    setChannel(state, { channel }) {
      state.channel = channel
      state.isConnecting = false
    },
    setEmail(state, { email }) {
      state.email = email
    },
    setPresences(state, { presences }) {
      state.presences = presences
    },
    setStatusEmoji(state, { emoji }) {
      state.status.emoji = emoji
    },
    startConnecting(state) {
      state.isConnecting = true
    },
    storeAllRoles(state, { roles }) {
      state.roles = roles
    },
    storeMessage(state, { payload }) {
      state.messages.push(payload)
    },
    unassignRole(state, { role }) {
      delete state.roles[role]
    },
  },
  actions: {
    assignRole({ state }, { role, email }) {
      state.channel.push('assign_role', { role, email })
    },
    connect({ commit }, { email, token }) {
      commit('setEmail', { email })
      localStorage.setItem('rabble.email', email)
      commit('startConnecting')
      connectSocket({
        email,
        token,
        onAllRolesReceived: ({ roles }) => commit('storeAllRoles', { roles }),
        onOk: (resp, channel) => commit('setChannel', { channel, resp }),
        onError: resp => commit('failToConnect', { resp }),
        onMessage: payload => commit('storeMessage', { payload }),
        onPresences: ({ presences }) => commit('setPresences', { presences }),
        onRoleAssigned: ({ role, email }) =>
          commit('assignRole', { role, email }),
        onRoleUnassigned: ({ role }) => commit('unassignRole', { role }),
      })
    },
    sendMessage({ state }, { body }) {
      state.channel.push('new_msg', { body })
    },
    setStatusEmoji({ commit, state }, { emoji }) {
      commit('setStatusEmoji', { emoji })
      state.status.emoji = emoji
      state.channel.push('set_status_emoji', { emoji })
    },
    unassignRole({ state }, { role }) {
      state.channel.push('unassign_role', { role })
    },
  },
})
