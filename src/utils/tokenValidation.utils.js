import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/envProcess.js'
import { responseHandler } from './responseHandler.utils.js'

export const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return responseHandler(res, true, 401, 'Unauthorized')
  }

  try {
    const token = authorization.split(' ')[1]
    verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return responseHandler(res, true, 401, 'Unauthorized')
      }

      req.user = user

      next()
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
