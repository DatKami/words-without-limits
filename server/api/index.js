import { Router } from 'express'

import rooms from './rooms'
import autoconnect from './autoconnect'

const router = Router()

// Add USERS Routes
router.use(rooms)
router.use(autoconnect)

export default router
