<template>
  <div>
    <span>{{ remainingSeconds }}</span>
    <form v-on:submit.prevent="start">
      <button type="submit">Start</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return { remainingSeconds: 1 }
  },
  components: {},
  created() {
    setInterval(this.update, 300)
  },
  methods: {
    start() {
      this.$store.dispatch('startTimer', { durationSeconds: 30 })
    },

    update() {
      this.remainingSeconds =
        ((this.$store.getters.timer &&
          this.$store.getters.timer.endTime.valueOf() - Date.now().valueOf()) ||
          0) / 1000
    },
  },
}
</script>
