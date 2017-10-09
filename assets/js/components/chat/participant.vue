<template>
  <div id="container">
    <span>{{ participant.statusEmoji && participant.statusEmoji.native }}</span>
    <gravatar :email="participant.email"></gravatar>
  </div>
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

export default {
  props: ['participant'],
  components: { Gravatar },
}
</script>
