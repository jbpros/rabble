<template>
  <img :src="url" :alt="alt"></img>
</template>

<style scope>
img { border-radius: 80px; }
</style>

<script>
import { createHash } from 'crypto'

export default {
  props: ['email'],
  computed: {
    alt() {
      return this.email
    },

    url() {
      console.log(this.email)
      const gravatarHash = createHash('md5')
        .update(this.email)
        .digest('hex')
      return `//www.gravatar.com/avatar/${gravatarHash}?s=80&d=mm`
    },
  },
}
</script>
