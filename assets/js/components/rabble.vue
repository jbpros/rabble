<template>
  <div>
    <div v-if="isConnected">
      <chat></chat>
    </div>
    <div v-else>
      Not connected.
      <login></login>
    </div>
  </div>
</template>

<script>
import Chat from './chat.vue'
import Login from './login.vue'

export default {
  components: {
    Chat,
    Login,
  },
  computed: {
    isConnected() {
      return this.$store.getters.isConnected
    },
  },
}
</script>
