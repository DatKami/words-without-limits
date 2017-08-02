import { Router } from 'express'
import Store from '../store'

let store = new Store()

const router = Router()

router.get('/autoconnect/:sessionId', function (req, res, next) {
  let room = store.getRoomBySessionId(req.params.sessionId)
  console.log("room " + room);
  res.json(room)
})

export default router
