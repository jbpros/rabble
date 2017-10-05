<template>
  <ul>
    <li v-for="participant in participants">
      {{ participant.statusEmoji && participant.statusEmoji.native }} {{ participant.email }}
    </li>
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
