import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
