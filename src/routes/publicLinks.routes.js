import { Router } from 'express'
import { publicLinks } from '../controllers/public.controllers'

const router = Router()

router.get('/:slug', publicLinks)

export default router
