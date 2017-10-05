import { Socket, Presence } from 'phoenix'

const connectSocket = ({
  email,
  token,
  onOk,
  onError,
  onMessage,
  onPresences,
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

  channel
    .join()
    .receive('ok', resp => onOk(resp, channel))
    .receive('error', onError)
}

export default connectSocket
