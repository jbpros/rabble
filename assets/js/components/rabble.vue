<template>
  <div>
    <div v-if="isConnected">
      <logout></logout>
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
import Logout from './logout.vue'
import Room from './room'

export default {
  components: {
    Login,
    Logout,
    Room,
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected
    },
  },
  created() {
    this.$store.dispatch('autoConnect')
  },
}
</script>
