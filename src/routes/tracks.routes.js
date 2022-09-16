import { Router } from 'express'
import { getTrack, getTracksBySpotifyId } from '../controllers/tracks.controllers.js'
import { tokenValidation } from '../utils/tokenValidation.utils'

const router = Router()

router.get('/', tokenValidation, getTrack)
router.get('/:id', tokenValidation, getTracksBySpotifyId)

export default router
