import * as frida from 'frida'
import code from './code'

interface Sender {
  momoid: string
  remoteId: string
  content: string
}

type Handler = (message: any) => void
type AwaitHandler = (Sender: any) => Promise<any>

interface MomoRef {
  bind: Handler
  send: AwaitHandler
}

const defineMomo = async (handle: Handler) => {
  const device = await frida.getUsbDevice()
  const session = await device.attach('MOMO陌陌')
  const script = await session.createScript(code)
  script.message.connect(handle)
  await script.load()
  return script
}

export const useMomo = () => {

  const ref: MomoRef = {
    bind: (message: any) => {},
    send: async (message: Sender) => Promise<any>
  }

  const onMessage = (handle: Handler) => {
    ref.bind = handle
  }

  const runApp = () => {
    defineMomo(ref.bind)
    .then((script) => {
      script.exports.init()
      script.exports.receive()
      ref.send = script.exports.post
    })
  }

  const sendMessage = (message: Sender) => {
    ref.send(message)
  }

  return { runApp, onMessage, sendMessage }
}

