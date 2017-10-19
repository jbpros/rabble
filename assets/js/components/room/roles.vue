<template>
  <ul>
    <li v-for="role in roles">
      <span>{{role}}:</span>
      <select v-model="roleAssignees[role]">
        <option disabled value="">Please select one</option>
        <option v-for="participant in participants">{{ participant.email }}</option>
      </select>
    </li>
  </ul>
</template>

<script>
import Participant from './participant.vue'

export default {
  data() {
    return { roles: ['driver', 'navigator'] }
  },
  components: { Participant },
  computed: {
    participants() {
      return this.$store.getters.participants
    },
    roleAssignees() {
      return this.$store.getters.roleAssignees
    },
  },
}
</script>
