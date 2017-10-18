<template>
  <div>
    <participants></participants>
    <status></status>
    <chat></chat>
  </div>
</template>

<script>
import Chat from '../chat'
import Participants from './participants.vue'
import Status from './status.vue'

export default {
  components: {
    Chat,
    Participants,
    Status,
  },
}
</script>
