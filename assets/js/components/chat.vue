<template>
  <div>
    <div v-if="isConnected">
      <participants></participants>
      <messages></messages>
      <chat-input></chat-input>
    </div>
    <div v-else>
      Not connected.
      <login></login>
    </div>
  </div>
</template>

<script>
import ChatInput from './chat-input.vue'
import Login from './login.vue'
import Messages from './messages.vue'
import Participants from './participants.vue'

export default {
  components: {
    ChatInput,
    Login,
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
}
</script>
