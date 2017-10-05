<template>
  <form v-on:submit.prevent="connect">
    <input type="email" v-model="email" placeholder="Your email..."></input>
    <button type="submit">Connect</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email:
        (window.location.search && window.location.search.slice(1)) || 'nobody',
    }
  },
  methods: {
    connect: function() {
      this.$store.dispatch('connect', {
        token: window.userToken,
        email: this.email,
      })
    },
  },
}
</script>
