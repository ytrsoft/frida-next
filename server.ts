import { useMomo } from './server/momo'

const { api, onOpen, onMessage } = useMomo()

onOpen(() => {
  api.value.init()
  api.value.receive()
})

onMessage((message) => {
  api.value.post(message)
})
