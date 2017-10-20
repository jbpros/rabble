<template>
  <form v-on:submit.prevent="disconnect">
    <button type="submit">Disconnect</button>
  </form>
</template>

<script>
export default {
  methods: {
    disconnect: function() {
      this.$store.dispatch('disconnect')
    },
  },
}
</script>
