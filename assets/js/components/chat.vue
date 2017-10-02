<template>
  <div>
    <messages></messages>
    <chat-input v-bind:channel="channel"></chat-input>
  </div>
</template>

<script>
import ChatInput from './chat-input.vue'
import Messages from './messages.vue'

export default {
  components: {
    ChatInput,
    Messages,
  },
}
</script>
