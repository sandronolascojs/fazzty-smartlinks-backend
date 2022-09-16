import { Router } from 'express'
import { signIn, signUp, updateUserInformation } from '../controllers/auth.controllers.js'
import { tokenValidation } from '../utils/tokenValidation.utils.js'

const router = Router()

router.post('/login', signIn)
router.post('/signup', signUp)
router.put('/update', tokenValidation, updateUserInformation)

export default router
