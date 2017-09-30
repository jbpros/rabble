import Vue from 'vue'
import Vuex from 'vuex'
import { Socket } from 'phoenix'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    channel: null,
    messages: [],
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
    connect({ commit, dispatch }) {
      const socket = new Socket('/socket', {
        params: { token: window.userToken, nickname: 'jbpros' },
      })
      socket.connect()

      const channel = socket.channel('room:lobby', {})

      channel.on('new_msg', payload => dispatch('receiveMessage', { payload }))

      channel
        .join()
        .receive('ok', resp => {
          commit('setChannel', { channel, resp })
        })
        .receive('error', resp => {
          alert('Failed to connect: ' + JSON.stringify(resp))
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
