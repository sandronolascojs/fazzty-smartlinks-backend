import User from '../models/users.model.js'
import { encryptPassword } from '../utils/bcrypt.utils.js'
import { responseHandler } from '../utils/responseHandler.utils.js'
import { customLabels } from '../utils/customLabels.utils.js'

export const getAllUsers = async (req, res, next) => {
  const { page, limit, username, email } = req.query

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: { createdAt: -1 },
    customLabels,
    populate: [
      {
        path: 'links',
        select: '_id'
      }
    ],
    select: '-hashPassword -updatedAt'
  }

  try {
    if (username || email) {
      const user = await User.paginate({ $or: [{ username }, { email }] }, options)

      if (user.data.length <= 0) return responseHandler(res, true, 404, 'User not found')

      return responseHandler(res, false, 200, 'Success', user)
    }

    const users = await User.paginate({}, options)

    if (users.data.length <= 0) return responseHandler(res, true, 404, 'No users found.')

    return responseHandler(res, false, 200, 'Success', users)
  } catch (err) {
    next(err)
  }
}

export const getOneUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId, {
      hashPassword: false,
      updatedAt: false
    }).populate('links', {
      _id: true,
      name: true,
      artists: true,
      releaseDate: true,
      images: true,
      previewUrl: true,
      links: true,
      explicit: true,
      createdAt: true
    })
    if (!user) return responseHandler(res, true, 404, 'No user found.')

    return responseHandler(res, false, 200, 'Success', user)
  } catch (err) {
    next(err)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { username, password, email, isAdmin } = req.body
    const validation = await User.find({ $or: [{ email }, { username }] })

    if (validation.length <= 0) return responseHandler(res, true, 409, 'Username or email already exists.')

    const hashPassword = await encryptPassword(password)
    const user = {
      username,
      hashPassword,
      email,
      isAdmin
    }
    const newUser = new User(user)
    const savedUser = await newUser.save()
    const data = {
      username: savedUser.username,
      email: savedUser.email,
      id: savedUser._id
    }

    return responseHandler(res, false, 201, 'Success', data)
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { username, password, email, isAdmin } = req.body

    const user = await User.findById(userId)
    if (!user) return responseHandler(res, true, 404, 'User not found.')

    const hashPassword = await encryptPassword(password)
    const updatedUser = {
      username,
      hashPassword,
      email,
      isAdmin
    }
    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { returnOriginal: false })

    const data = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      admin: savedUser.isAdmin
    }

    return responseHandler(res, false, 200, 'Success', data)
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) return responseHandler(res, true, 404, 'User not found.')

    const deletedUser = await User.findByIdAndDelete(userId)

    const data = {
      email: deletedUser.email,
      username: deletedUser.username
    }

    return responseHandler(res, false, 200, 'User deleted.', data)
  } catch (err) {
    next(err)
  }
}
