import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/envProcess.js'

export const createToken = (user) => {
  const { _id, username, isAdmin } = user
  const token = sign({
    id: _id,
    username,
    admin: isAdmin
  }, JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7
  })
  return token
}
