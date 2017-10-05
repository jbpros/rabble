<template>
  <ul>
    <li v-for="participant in participants">
      <participant :participant="participant"></participant>
    </li>
  </ul>
</template>

<style scoped>
ul { list-style: none; }
li { display: inline; }
</style>

<script>
import Participant from './participant.vue'

export default {
  components: { Participant },
  computed: {
    participants() {
      return this.$store.getters.participants
    },
  },
}
</script>
