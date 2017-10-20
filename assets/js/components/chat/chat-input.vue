<template>
  <form id="chat-input" v-on:submit.prevent="send">
    <input v-model="text" placeholder="Your comment..."></input>
    <button type="submit">Send</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      text: '',
    }
  },
  methods: {
    send() {
      this.$store.dispatch('sendMessage', { body: this.text })
      this.text = ''
    },
  },
}
</script>

<style scoped>
button { color: red; }
</style>
