import { useMomo } from './server/momo'

const { onOpen, onMessage } = useMomo()

onOpen((exports) => {
  exports.init()
  exports.receive()
})

onMessage((message) => {
  console.log('消息', message)
})
