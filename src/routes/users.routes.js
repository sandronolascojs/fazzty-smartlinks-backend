import { Router } from 'express'
import { createUser, deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/users.controllers.js'
import { tokenValidation } from '../utils/tokenValidation.utils.js'
import { verifyAdmin } from '../utils/verifyAdmin.utils.js'

const router = Router()

router.get('/', tokenValidation, verifyAdmin, getAllUsers)

router.get('/:userId', tokenValidation, verifyAdmin, getOneUser)

router.post('/', tokenValidation, verifyAdmin, createUser)

router.put('/:userId', tokenValidation, verifyAdmin, updateUser)

router.delete('/:userId', tokenValidation, verifyAdmin, deleteUser)

export default router
