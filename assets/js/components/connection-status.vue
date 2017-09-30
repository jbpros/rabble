<template>
  <div>
    {{ channelStatus }}
  </div>
</template>
<script>
export default {
  computed: {
    channelStatus() {
      return this.$store.getters.isConnected ? 'online' : 'offline'
    },
  },
}
</script>
