<template>
  <div>
    <div v-if="isConnected">
      <room></room>
    </div>
    <div v-else>
      Not connected.
      <login></login>
    </div>
  </div>
</template>

<script>
import Login from './login.vue'
import Room from './room.vue'

export default {
  components: {
    Login,
    Room,
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected
    },
  },
}
</script>
