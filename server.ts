import { useMomo } from './based/momo'
import { useWebSocket } from './based/index'

const {
  setup,
  onMessage,
  sendMessage
} = useMomo()

const {
  onBoot,
  onConnected,
  onReceive,
  postMessage
} = useWebSocket()


onBoot(() => {
  console.log('服务器启动')
}, 7788)

onMessage(postMessage)

onConnected(setup)

onReceive(sendMessage)
