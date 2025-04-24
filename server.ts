import { useMomo } from './server/momo'

useMomo((api) => {
  api.init()
  api.receive()
})
