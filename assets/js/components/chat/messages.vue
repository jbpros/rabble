<template>
  <ul>
    <li v-for="message in messages"><strong>{{ message.email}}:</strong> {{ message.body }}</li>
  </ul>
</template>

<script>
export default {
  computed: {
    messages() {
      return this.$store.getters.messages
    },
  },
}
</script>
