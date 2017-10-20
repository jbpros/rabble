<template>
  <transition @enter="onJoin" appear v-bind:css="false">
    <div class="container">
      <span class="status-emoji">{{ participant.statusEmoji && participant.statusEmoji.native }}</span>
      <ul class="roles">
        <li class="role" v-for="role in participant.roles">{{role}}</li>
      </ul>
      <gravatar :email="participant.email"></gravatar>
    </div>
  </transition>
</template>

<style scoped>
.container {
  display: inline-block;
  position: relative;
}

.status-emoji {
  font-size: 64px;
  position: absolute;
  right: 0;
  text-shadow: -1px -1px 0px white, -1px 1px 0px white, 1px 1px 0px white, 1px -1px 0px white;
}

.roles {
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.role {
  margin: 2px 2px 0;
  padding: 3px;
  background: rgba(255,255,255,.8);
  border-radius: 4px;
  border: solid 1px rgba(0,0,0,.1)
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
