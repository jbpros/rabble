<template>
  <ul>
    <li v-for="role in roles">
      <span>{{role}}:</span>
      <select v-model="roleAssigneeEmails[role]" @change="assignRole(role, roleAssigneeEmails[role])">
        <option :value="undefined">(nobody)</option>
        <option v-for="participant in participants">{{ participant.email }}</option>
      </select>
    </li>
  </ul>
</template>

<script>
import Participant from './participant.vue'

export default {
  data() {
    return {
      roles: ['navigator', 'driver', 'facilitator', 'scout', 'housekeeper'],
    }
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
      typeof email === 'undefined'
        ? this.$store.dispatch('unassignRole', { role })
        : this.$store.dispatch('assignRole', { role, email })
    },
  },
}
</script>
