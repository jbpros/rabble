<template>
  <ul>
    <li v-for="participant in participants">{{ participant.nickname}}</li>
  </ul>
</template>

<script>
export default {
  computed: {
    participants() {
      return this.$store.getters.participants
    },
  },
}
</script>
