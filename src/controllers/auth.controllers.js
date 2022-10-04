import { createToken } from '../utils/jwtToken.utils.js'
import User from '../models/users.model.js'
import { encryptPassword, comparePassword } from '../utils/bcrypt.utils.js'
import { responseHandler } from '../utils/responseHandler.utils.js'

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    const searchUser = await User.find({ $or: [{ email }, { username }] })

    if (searchUser[0]) {
      return responseHandler(res, true, 409, 'username/email already exists.')
    }

    const encryptedPassword = await encryptPassword(password)

    const newUser = new User({
      username,
      email,
      hashPassword: encryptedPassword
    })
    const user = new User(newUser)

    const token = createToken(user)

    await user.save()

    const data = {
      username: user.username,
      email: user.email,
      _id: user._id,
      token
    }
    return responseHandler(res, false, 201, 'Success', data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const signIn = async (req, res, next) => {
  const { email, username, password } = req.body
  const searchUser = await User.find({ $or: [{ email }, { username }] })
  const user = searchUser[0]

  if (searchUser === undefined || searchUser.length === 0) {
    return responseHandler(res, true, 401, 'username/email or password incorrect.')
  }
  try {
    const passwordValidation = await comparePassword(password, user.hashPassword)
    if (!passwordValidation) {
      return responseHandler(res, true, 401, 'username/email or password incorrect.')
    }

    const token = createToken(user)

    const data = {
      id: user._id,
      username: user.username,
      admin: user.isAdmin,
      token
    }

    return responseHandler(res, false, 200, 'Success', data)
  } catch (err) {
    next(err)
  }
}

export const updateUserInformation = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { id } = req.user
    const { username, password, email } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return responseHandler(res, true, 404, 'User not found.')
    }

    if (id !== user._id) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    const encryptedPassword = user.hashPassword
    const passwordValidation = await comparePassword(password, encryptedPassword)
    if (!passwordValidation) {
      return responseHandler(res, true, 400, 'Incorrect password.')
    }
    const hashPassword = await encryptPassword(password)
    const updatedUser = {
      username,
      hashPassword,
      email
    }

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { returnOriginal: false })

    const data = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    }

    return responseHandler(res, false, 200, 'Success', data)
  } catch (err) {
    next(err)
  }
}
