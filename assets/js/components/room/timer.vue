<template>
  <div>
    <p>{{ remainingSeconds | asTime }}</p>
    <button v-on:click="start(300)">5m</button>
    <button v-on:click="start(600)">10m</button>
    <button v-on:click="start(900)">15m</button>
    <button v-on:click="start(1200)">20m</button>
    <button v-on:click="adjust(-30)">-30s</button>
    <button v-on:click="stop()">0</button>
    <button v-on:click="adjust(30)">+30s</button>
  </div>
</template>

<script>
const pad = n => String(n).padStart(2, '0')

export default {
  data() {
    return { remainingSeconds: 0 }
  },
  components: {},
  created() {
    this.update()
  },
  filters: {
    asTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds) % 60
      return `${pad(mins)}:${pad(secs)}`
    },
  },
  methods: {
    start(seconds) {
      this.$store.dispatch('startTimer', { durationSeconds: seconds })
    },

    stop() {
      this.$store.dispatch('startTimer', { durationSeconds: 0 })
    },

    adjust(seconds) {
      this.$store.dispatch('startTimer', {
        durationSeconds: Math.floor(this.remainingSeconds + seconds),
      })
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
