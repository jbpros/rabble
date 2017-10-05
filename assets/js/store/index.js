import Vue from 'vue'
import Vuex from 'vuex'
import connectSocket from '../lib/connect_socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    channel: null,
    isConnecting: false,
    messages: [],
    presences: {},
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
    participants(state) {
      return Object.keys(state.presences).map(nickname => ({
        nickname,
        statusEmoji: state.presences[nickname].metas[0].status_emoji,
      }))
    },
    status(state) {
      return state.status
    },
    statusEmojiNative(state) {
      return (state.status.emoji && state.status.emoji.native) || ''
    },
  },
  mutations: {
    failToConnect(state, { resp }) {
      state.isConnecting = false
      alert(`Failed to connect (${JSON.stringify(resp)})`)
    },
    setChannel(state, { channel }) {
      state.channel = channel
      state.isConnecting = false
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
    storeMessage(state, { payload }) {
      state.messages.push(payload)
    },
  },
  actions: {
    connect({ commit, dispatch }, { nickname, token }) {
      commit('startConnecting')
      connectSocket({
        nickname,
        token,
        onOk: (resp, channel) => commit('setChannel', { channel, resp }),
        onError: resp => commit('failToConnect', { resp }),
        onMessage: payload => dispatch('receiveMessage', { payload }),
        onPresences: ({ presences }) => commit('setPresences', { presences }),
      })
    },
    receiveMessage({ commit }, { payload }) {
      commit('storeMessage', { payload })
    },
    sendMessage({ state }, { body }) {
      state.channel.push('new_msg', { body })
    },
    setStatusEmoji({ commit, state }, { emoji }) {
      commit('setStatusEmoji', { emoji })
      state.status.emoji = emoji
      state.channel.push('set_status_emoji', { emoji })
    },
  },
})
