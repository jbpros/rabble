<template>
  <div>
    <participants></participants>
    <roles></roles>
    <status></status>
    <chat></chat>
    <timer></timer>
  </div>
</template>

<script>
import Chat from '../chat'
import Participants from './participants.vue'
import Roles from './roles.vue'
import Status from './status.vue'
import Timer from './timer.vue'

export default {
  components: {
    Chat,
    Participants,
    Roles,
    Status,
    Timer,
  },
}
</script>
