import User from '../models/users.model'
import { responseHandler } from './responseHandler.utils'

export const verifyAdmin = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return responseHandler(res, true, 401, 'Unauthorized')
  }

  const { id } = req.user
  try {
    const user = await User.findById(id)
    if (user.isAdmin) {
      next()
    } else {
      return responseHandler(res, true, 403, 'Forbidden')
    }
  } catch (err) {
    next(err)
  }
}
