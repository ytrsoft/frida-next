import * as frida from 'frida'
import code from './code'

export interface Sender {
  momoid: string
  remoteId: string
  content: string
}

export type SignalHandler = (message: any) => void

const defineMomo = async (handle: SignalHandler) => {
  const device = await frida.getUsbDevice()
  const session = await device.attach('MOMO陌陌')
  const script = await session.createScript(code)
  script.message.connect(handle)
  await script.load()
  return script
}

export const useMomo = () => {
  const ref: any = {}

  const msgHandle = { value: (message: any) => {} }

  const onMessage = (handle: SignalHandler) => {
    msgHandle.value = handle
  }

  const setup = () => {
    defineMomo((message) => {
      msgHandle.value(message)
    })
    .then((script) => {
      script.exports.init()
      script.exports.receive()
      ref.send = script.exports.post
      process.on('SIGINT', () => {
        script?.unload()
      })
    })
  }

  const sendMessage = (message: Sender) => {
    ref.send && ref.send(message)
  }

  return { setup, onMessage, sendMessage }
}

