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
    this.update()
  },
  methods: {
    start() {
      this.$store.dispatch('startTimer', { durationSeconds: 30 })
    },

    update() {
      if (!this.$store.getters.timer) {
        this.remainingSeconds = 0
      } else {
        const endTime = this.$store.getters.timer.endTime.valueOf()
        const now = Date.now().valueOf()
        if (now > endTime) this.remainingSeconds = 0
        else this.remainingSeconds = (endTime - now || 0) / 1000
      }
      requestAnimationFrame(this.update)
    },
  },
}
</script>
