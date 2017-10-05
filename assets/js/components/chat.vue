<template>
  <div>
    <div v-if="isConnected">
      <participants></participants>
      <status></status>
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
import ChatInput from './chat/chat-input.vue'
import Login from './login.vue'
import Messages from './chat/messages.vue'
import Participants from './chat/participants.vue'
import Status from './chat/status.vue'

export default {
  components: {
    ChatInput,
    Login,
    Messages,
    Participants,
    Status,
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
