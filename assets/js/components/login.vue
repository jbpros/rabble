<template>
  <form v-on:submit.prevent="connect">
    <input type="email" v-model="email" placeholder="Your email..."></input>
    <button type="submit">Connect</button>
  </form>
</template>

<script>
export default {
  data() {
    return { email: this.$store.getters.email || '' }
  },
  methods: {
    connect: function() {
      this.$store.dispatch('connect', {
        email: this.email,
      })
    },
  },
}
</script>
