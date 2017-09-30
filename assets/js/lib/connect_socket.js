import { Socket } from 'phoenix'

const connectSocket = ({ onOk, onError, onMessage }) => {
  const socket = new Socket('/socket', {
    params: { token: window.userToken, nickname: 'jbpros' },
  })
  socket.connect()

  const channel = socket.channel('room:lobby', {})

  channel.on('new_msg', onMessage)

  channel
    .join()
    .receive('ok', resp => onOk(resp, channel))
    .receive('error', onError)
}

export default connectSocket
