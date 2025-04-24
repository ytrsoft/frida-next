import { useMomo } from './server/momo'

const { api, onOpen, onMessage } = useMomo()

onOpen(() => {
  api.value.init()
  api.value.receive()
})

onMessage((message) => {
  console.log('消息', message)
})
