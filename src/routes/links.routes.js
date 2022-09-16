import { Router } from 'express'
import { getLinks, getSingleLink, saveLink, updateLink, deleteLink } from '../controllers/links.controllers.js'
import { tokenValidation } from '../utils/tokenValidation.utils.js'

const router = Router()

router.get('/', tokenValidation, getLinks)

router.get('/:id', tokenValidation, getSingleLink)

router.post('/', tokenValidation, saveLink)

router.put('/:id', tokenValidation, updateLink)

router.delete('/:id', tokenValidation, deleteLink)

export default router
