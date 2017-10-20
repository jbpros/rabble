<template>
  <ul>
    <li v-for="role in roles">
      <span>{{role}}:</span>
      <select v-model="roleAssigneeEmails[role]" @change="assignRole(role, roleAssigneeEmails[role])">
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
    roleAssigneeEmails() {
      return this.$store.getters.roleAssigneeEmails
    },
  },
  methods: {
    assignRole(role, email) {
      this.$store.dispatch('assignRole', { role, email })
      console.log('new role assignee', role, email)
    },
  },
}
</script>
