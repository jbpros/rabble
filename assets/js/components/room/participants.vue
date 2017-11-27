<template>
  <transition-group tag="ul" @enter="onJoin" v-on:leave="onLeave" appear v-bind:css="false">
    <li v-for="participant in participants" v-bind:key="participant.email">
      <participant :participant="participant"></participant>
    </li>
  </transition-group>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

li {
  display: inline;
}
</style>

<script>
import Participant from './participant.vue'
import animate from 'animateplus'

export default {
  components: { Participant },
  computed: {
    participants() {
      return this.$store.getters.participants
    },
  },
  methods: {
    async onJoin(el) {
      await animate({
        elements: el,
        transform: ['translateY(-500px)', 'translateY(0px)'],
        easing: 'out-elastic',
        duration: 700,
      })
    },

    async onLeave(el, done) {
      await animate({
        elements: el,
        transform: ['translateY(0px)', 'translateY(500px)'],
        easing: 'in-quintic',
        duration: 300,
      })
      done()
    },
  },
}
</script>
