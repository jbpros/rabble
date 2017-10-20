<template>
  <ul>
    <li v-for="message in messages">
      <gravatar class="avatar" :email="message.email"></gravatar> <strong>{{message.email | username }}</strong>: {{ message.body }}
    </li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: space-evenly;
}

li {
  display: flex;
}

.avatar {
  width: 1em;
  height: 1em;
  margin: 0 4px 0 0;
}

</style>

<script>
import Gravatar from '../gravatar.vue'

export default {
  components: { Gravatar },
  computed: {
    messages() {
      return this.$store.getters.messages
    },
  },
  filters: {
    username: email => email.split('@')[0],
  },
}
</script>
