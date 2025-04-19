import { WebSocket } from 'ws'
import { useFrida, getNextApp, connectWebSocket } from './server/index'

(async() => {
  const app = getNextApp()
  await app.prepare()
  const wss = connectWebSocket(app, () => {
    console.log('服务启动')
  })
  wss.on('connection', (ws: WebSocket) => {
    setupFirda(ws)
  })
})()

const setupFirda = (ws: WebSocket) => {
  useFrida({
    processName: 'MOMO陌陌',
    script: `
      rpc.exports = {
        receive: () => {
          send({id: 1024})
        }
      }
    `,
    onMessage: (message) => {
      console.log(JSON.stringify(message))
      ws.send(JSON.stringify(message))
    }
  }).then((inst) => {
    inst.api.receive()
    process.on('SIGINT', () => {
      inst.unload()
    })
  })
}
