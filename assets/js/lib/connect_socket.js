import { Socket, Presence } from 'phoenix'

const connectSocket = ({
  email,
  token,
  onAllRolesReceived,
  onTimerReceived,
  onOk,
  onError,
  onMessage,
  onPresences,
  onRoleAssigned,
  onRoleUnassigned,
}) => {
  let presences = {}
  const socket = new Socket('/socket', {
    params: { token, email },
  })
  socket.connect()

  const channel = socket.channel('room:lobby', {})

  channel.on('new_msg', onMessage)

  channel.on('presence_state', state => {
    presences = Presence.syncState(presences, state)
    onPresences({ presences })
  })

  channel.on('presence_diff', diff => {
    presences = Presence.syncDiff(presences, diff)
    onPresences({ presences })
  })

  channel.on('all_roles', roles => onAllRolesReceived({ roles }))

  channel.on('assign_role', ({ role, email }) =>
    onRoleAssigned({ role, email })
  )

  channel.on('unassign_role', ({ role }) => onRoleUnassigned({ role }))

  channel.on('timer_running', ({ end_time: endTime }) =>
    onTimerReceived({ endTime: new Date(endTime) })
  )

  channel
    .join()
    .receive('ok', resp => onOk(resp, channel))
    .receive('error', onError)

  return socket
}

export default connectSocket
