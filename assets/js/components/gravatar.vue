<template>
  <img :src="url" :alt="alt" :title="alt"></img>
</template>

<style scope>
img {
  border-radius: 100px;
}
</style>

<script>
import { createHash } from 'crypto'

export default {
  props: { email: String, size: { type: Number, default: 200 } },
  computed: {
    alt() {
      return this.email
    },

    url() {
      const gravatarHash = createHash('md5')
        .update(this.email)
        .digest('hex')
      return `//www.gravatar.com/avatar/${gravatarHash}?s=${this.size}&d=mm`
    },
  },
}
</script>
