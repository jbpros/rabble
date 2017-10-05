<template>
  <ul>
    <li v-for="participant in participants">
      <participant :participant="participant"></participant>
    </li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

li {
  display: inline;
}
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
