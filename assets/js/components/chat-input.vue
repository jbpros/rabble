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
    send: function() {
      this.channel.push('new_msg', { body: this.text })
      this.text = ''
    },
  },
  props: { channel: { type: Object } },
}
</script>

<style scoped>
button { color: red; }
</style>
