<template>
  <transition @enter="onJoin" appear v-bind:css="false">
    <div id="container">
      <span>{{ participant.statusEmoji && participant.statusEmoji.native }}</span>
      <gravatar :email="participant.email"></gravatar>
    </div>
  </transition>
</template>

<style scoped>
#container {
  display: inline-block;
  position: relative;
}

span {
  font-size: 64px;
  position: absolute;
  right: 0;
  text-shadow: -1px -1px 0px white, -1px 1px 0px white, 1px 1px 0px white, 1px -1px 0px white;
}
</style>

<script>
import Gravatar from '../gravatar.vue'
import animate from '../../../vendor/animate'

export default {
  props: ['participant'],
  components: { Gravatar },
  methods: {
    onJoin: async el => {
      await animate({
        elements: el,
        transform: ['translateY(-500px)', ' translateY(0px)'],
        easing: 'out-elastic',
        duration: 700,
      })
    },
  },
}
</script>
