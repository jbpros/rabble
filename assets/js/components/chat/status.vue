<template>
  <div>
    <picker v-show="pickingEmoji" title="" emoji=":cucumber:" @click="pickStatusEmoji"></picker>
    <button @click="startPickingEmoji">{{ statusEmoji }}</button>
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
  },
}
</script>
