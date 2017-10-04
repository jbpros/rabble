<template>
  <div>
    <div v-if="isConnected">
      <participants></participants>
      <messages></messages>
      <chat-input></chat-input>
    </div>
    <div v-else>
      Not connected.
      <form v-on:submit.prevent="connect">
        <input v-model="nickname" placeholder="Your nickname..."></input>
        <button type="submit">Connect</button>
      </form>
    </div>
  </div>
</template>

<script>
import ChatInput from './chat-input.vue'
import Messages from './messages.vue'
import Participants from './participants.vue'

export default {
  components: {
    ChatInput,
    Messages,
    Participants,
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected
    },
    isConnecting() {
      return this.$store.getters.isConnecting
    },
  },
  data() {
    return {
      nickname:
        (window.location.search && window.location.search.slice(1)) || 'nobody',
    }
  },
  methods: {
    connect: function() {
      this.$store.dispatch('connect', {
        token: window.userToken,
        nickname: this.nickname,
      })
    },
  },
}
</script>
