<template>
  <div>
    <participants></participants>
    <status></status>
    <messages></messages>
    <chat-input></chat-input>
  </div>
</template>

<script>
import ChatInput from './room/chat-input.vue'
import Messages from './room/messages.vue'
import Participants from './room/participants.vue'
import Status from './room/status.vue'

export default {
  components: {
    ChatInput,
    Messages,
    Participants,
    Status,
  },
}
</script>
