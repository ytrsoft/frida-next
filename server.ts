import { useMomo } from './based/momo'
import { useWebSocket } from './based/index'

const {
  runApp,
  onMessage,
  sendMessage
} = useMomo()

const {
  onCreated,
  onConnected,
  onReceive,
  postMessage
} = useWebSocket()

onCreated(() => {
  console.log('服务器准备就绪')
}, 3024)

onMessage(postMessage)

onConnected(runApp)

onReceive(sendMessage)
