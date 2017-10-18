<template>
  <div>
    <participants></participants>
    <status></status>
    <messages></messages>
    <chat-input></chat-input>
  </div>
</template>

<script>
import ChatInput from './chat/chat-input.vue'
import Messages from './chat/messages.vue'
import Participants from './chat/participants.vue'
import Status from './chat/status.vue'

export default {
  components: {
    ChatInput,
    Messages,
    Participants,
    Status,
  },
}
</script>
