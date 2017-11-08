<template>
  <div class="container" v-bind:class="{ distracted: participant.distracted }">
    <span class="status-emoji" >{{ participant.statusEmoji && participant.statusEmoji.native }}</span>
    <ul class="roles">
      <li class="role" v-for="role in participant.roles">{{role}}</li>
    </ul>
    <gravatar :email="participant.email"></gravatar>
  </div>
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

.distracted {
  opacity: .4;
  filter: grayscale(100%);
}
</style>

<script>
import Gravatar from '../gravatar.vue'

export default {
  props: ['participant'],
  components: { Gravatar },
}
</script>
