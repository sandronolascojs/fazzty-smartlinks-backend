import { Router } from 'express'
import { findLinkMostPopular } from '../controllers/links.controllers'
import { tokenValidation } from '../utils/tokenValidation.utils'

const router = Router()

router.get('/', tokenValidation, findLinkMostPopular)

export default router
