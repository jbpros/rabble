import Vue from 'vue'
import Vuex from 'vuex'
import connectSocket from '../lib/connect_socket'
import toObject from '../lib/to_object'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    channel: null,
    email: localStorage.getItem('rabble.email') || '',
    isConnecting: false,
    messages: [],
    presences: {},
    roles: {},
    socket: null,
    status: { emoji: null },
    timer: null,
    token: window.userToken,
  },

  getters: {
    channel: state => state.channel,

    timer: state => state.timer,

    email: state => state.email,

    isConnected: state => !!state.channel,

    isConnecting: state => state.isConnecting,

    isKnownParticipantEmail: (state, { participantEmails }) => email =>
      participantEmails.indexOf(email) > -1,

    me: (state, getters) =>
      getters.participants.find(p => p.email === getters.email),

    amDistracted: (state, getters) => getters.me && getters.me.distracted,

    messages: state => state.messages,

    participantEmails: state =>
      Object.keys(state.presences).map(email => email),

    participants: (state, { participantRoles }) =>
      Object.entries(state.presences).map(([email, presence]) => ({
        email,
        statusEmoji: presence.metas[0].status_emoji,
        distracted: presence.metas[0].distracted,
        roles: participantRoles(email),
      })),

    participantRoles: state => participantEmail =>
      Object.entries(state.roles).reduce(
        (roles, [role, email]) =>
          email === participantEmail ? roles.concat([role]) : roles,
        []
      ),

    distractedParticipantEmails: (state, { participants }) =>
      participants.filter(p => p.distracted).map(p => p.email),

    roleAssigneeEmails: (state, { isKnownParticipantEmail }) =>
      toObject(
        Object.entries(state.roles).filter(([, email]) =>
          isKnownParticipantEmail(email)
        )
      ),
  },

  mutations: {
    assignRole: (state, { role, email }) => Vue.set(state.roles, role, email),

    failToConnect: (state, { resp }) => {
      state.isConnecting = false
      alert(`Failed to connect (${JSON.stringify(resp)})`)
    },

    setChannel: (state, { channel }) => {
      state.channel = channel
      state.isConnecting = false
    },

    setTimer: (state, timer) => {
      state.timer = timer
    },

    setEmail: (state, { email }) => (state.email = email),

    setPresences: (state, { presences }) => (state.presences = presences),

    setSocket: (state, { socket }) => (state.socket = socket),

    setStatusEmoji: (state, { emoji }) => (state.status.emoji = emoji),

    startConnecting: state => (state.isConnecting = true),

    storeAllRoles: (state, { roles }) => (state.roles = roles),

    storeMessage: (state, { payload }) => state.messages.push(payload),

    unassignRole: (state, { role }) => Vue.delete(state.roles, role),
  },

  actions: {
    assignRole: ({ state }, { role, email }) =>
      state.channel.push('assign_role', { role, email }),

    autoConnect: ({ dispatch, state: { email } }) =>
      localStorage.getItem('rabble.autoconnect') === 'true' && email !== ''
        ? dispatch('connect', { email, token: '?' })
        : null,

    connect: ({ commit, dispatch, state: { token } }, { email }) => {
      commit('setEmail', { email })
      localStorage.setItem('rabble.email', email)
      localStorage.setItem('rabble.autoconnect', true)
      commit('startConnecting')
      const socket = connectSocket({
        email,
        token,
        onAllRolesReceived: ({ roles }) => commit('storeAllRoles', { roles }),
        onTimerReceived: timer => commit('setTimer', timer),
        onOk: (resp, channel) => commit('setChannel', { channel, resp }),
        onError: resp => commit('failToConnect', { resp }),
        onMessage: payload => commit('storeMessage', { payload }),
        onPresences: ({ presences: newPresences }) =>
          dispatch('receivePresences', { newPresences }),
        onRoleAssigned: ({ role, email }) =>
          commit('assignRole', { role, email }),
        onRoleUnassigned: ({ role }) => commit('unassignRole', { role }),
      })
      commit('setSocket', { socket })
    },

    disconnect: ({ state }) => {
      state.socket.disconnect()
      state.socket = null
      state.channel = null
      state.isConnecting = false
      localStorage.setItem('rabble.autoconnect', false)
    },

    receivePresences: ({ commit, state, getters }, { newPresences }) => {
      const previousEmails = Object.keys(state.presences).map(email => email)
      const currentEmails = Object.keys(newPresences).map(email => email)
      const goneEmails = previousEmails.filter(
        email => email !== state.email && currentEmails.indexOf(email) === -1
      )
      const newEmails = currentEmails.filter(
        email => email !== state.email && previousEmails.indexOf(email) === -1
      )
      for (const email of goneEmails)
        if (email !== getters.email)
          new Notification('Rabble', { body: `${email} has left` })
      for (const email of newEmails)
        if (email !== getters.email)
          new Notification('Rabble', { body: `${email} has joined` })

      const previouslyDistractedParticipantEmails =
        getters.distractedParticipantEmails
      commit('setPresences', { presences: newPresences })
      const newlyDistractedParticipantEmails = getters.distractedParticipantEmails.filter(
        email => previouslyDistractedParticipantEmails.indexOf(email) === -1
      )

      const newlyFocussedParticipantEmails = previouslyDistractedParticipantEmails.filter(
        email =>
          getters.distractedParticipantEmails.indexOf(email) === -1 &&
          getters.participantEmails.indexOf(email) > -1
      )

      for (const email of newlyDistractedParticipantEmails)
        if (email !== getters.email)
          new Notification('Rabble', {
            body: `${email} is not paying attention anymore`,
          })

      for (const email of newlyFocussedParticipantEmails)
        if (email !== getters.email)
          new Notification('Rabble', { body: `${email} is focussed again` })
    },

    setAttention: ({ state }, { distracted }) =>
      state.channel.push('set_attention', { distracted }),

    sendMessage: ({ state }, { body }) =>
      state.channel.push('new_msg', { body }),

    setStatusEmoji: ({ commit, state }, { emoji }) => {
      commit('setStatusEmoji', { emoji })
      state.status.emoji = emoji
      state.channel.push('set_status_emoji', { emoji })
    },

    startTimer: ({ state }, { durationSeconds }) =>
      state.channel.push('start_timer', { duration_seconds: durationSeconds }),

    unassignRole: ({ state }, { role }) =>
      state.channel.push('unassign_role', { role }),
  },
})
