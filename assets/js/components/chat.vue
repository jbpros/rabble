<template>
  <div>
    <participants></participants>
    <messages></messages>
    <chat-input></chat-input>
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
}
</script>
