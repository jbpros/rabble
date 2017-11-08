<template>
  <div>
    <picker v-show="pickingEmoji" title="" emoji=":cucumber:" @click="pickStatusEmoji"></picker>
    <button @click="startPickingEmoji">{{ statusEmoji }}</button>
    <button @click="toggleAttention">{{ attention }}</button>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'

export default {
  components: { Picker },
  data() {
    return { pickingEmoji: false }
  },
  computed: {
    attention() {
      return this.$store.getters.amDistracted ? 'distracted' : 'attentive'
    },
    statusEmoji() {
      return (
        this.$store.getters.me &&
        this.$store.getters.me.statusEmoji &&
        this.$store.getters.me.statusEmoji.native
      )
    },
  },
  methods: {
    pickStatusEmoji(emoji) {
      this.pickingEmoji = false
      this.$store.dispatch('setStatusEmoji', { emoji })
    },
    startPickingEmoji() {
      this.pickingEmoji = !this.pickingEmoji
    },
    toggleAttention() {
      this.$store.dispatch('setAttention', {
        distracted: !this.$store.getters.amDistracted,
      })
    },
  },
}
</script>
