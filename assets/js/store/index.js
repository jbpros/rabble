import Vue from 'vue'
import Vuex from 'vuex'
import connectSocket from '../lib/connect_socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    channel: null,
    messages: [],
    presences: {},
  },
  getters: {
    channel(state) {
      return state.channel
    },
    isConnected(state) {
      return !!state.channel
    },
    messages(state) {
      return state.messages
    },
    participants(state) {
      return Object.keys(state.presences).map(nickname => ({ nickname }))
    },
  },
  mutations: {
    setChannel(state, { channel }) {
      state.channel = channel
    },
    setPresences(state, { presences }) {
      state.presences = presences
    },
    storeMessage(state, { payload }) {
      state.messages.push(payload)
    },
  },
  actions: {
    connect({ commit, dispatch }, { nickname, token }) {
      connectSocket({
        nickname,
        token,
        onOk: (resp, channel) => commit('setChannel', { channel, resp }),
        onError: resp => alert('Failed to connect: ' + JSON.stringify(resp)),
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
  },
})
