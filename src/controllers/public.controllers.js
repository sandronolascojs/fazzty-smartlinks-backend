import Link from '../models/links.model.js'
import { responseHandler } from '../utils/responseHandler.utils.js'

export const publicLinks = async (req, res, next) => {
  const { slug } = req.params
  try {
    const link = await Link.findOne({ publicUrl: slug })
    if (link && link.visible) {
      const data = {
        artists: link.artists,
        name: link.name,
        previewUrl: link.previewUrl,
        links: link.links,
        images: link.images,
        releaseDate: link.releaseDate,
        explicit: link.explicit
      }

      /* const visits = {
        visits: [...link.visits, new Date()]
      }

      await Link.findOneAndUpdate({ _id: link._id }, visits) */
      return responseHandler(res, false, 200, 'Success', data)
    } else {
      return responseHandler(res, true, 404, 'Link not found')
    }
  } catch (err) {
    next(err)
  }
}
