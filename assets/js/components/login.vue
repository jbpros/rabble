<template>
  <form v-on:submit.prevent="connect">
    <input v-model="nickname" placeholder="Your nickname..."></input>
    <button type="submit">Connect</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      nickname:
        (window.location.search && window.location.search.slice(1)) || 'nobody',
    }
  },
  methods: {
    connect: function() {
      this.$store.dispatch('connect', {
        token: window.userToken,
        nickname: this.nickname,
      })
    },
  },
}
</script>
