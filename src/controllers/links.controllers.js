import Link from '../models/links.model.js'
import User from '../models/users.model.js'
import { responseHandler } from '../utils/responseHandler.utils.js'

export const getLinks = async (req, res, next) => {
  const { user } = req
  try {
    const searchUser = await User.findById(user.id)

    if (!searchUser.isAdmin) {
      const links = await Link.find({ user: user.id })
      return responseHandler(res, false, 200, 'Success', links)
    } else if (!searchUser) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }
    const links = await Link.find()

    return responseHandler(res, false, 200, 'Success.', links)
  } catch (err) {
    next(err)
  }
}
export const getSingleLink = async (req, res, next) => {
  const { id } = req.params
  try {
    const link = await Link.findById(id)
    link ? responseHandler(res, false, 200, 'Success', link) : responseHandler(res, true, 404, 'Link not found.')
  } catch (err) {
    next(err)
  }
}

export const saveLink = async (req, res, next) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    const { artists, name, previewUrl, links, customLinks, images, releaseDate, explicit, slug } = req.body

    const compareSlug = slug.toLowerCase().replace(/ /g, '-')
    const findSlug = await Link.findOne({ publicUrl: compareSlug })
    if (findSlug) {
      return responseHandler(res, true, 409, 'Slug already exists.')
    }

    const link = {
      artists,
      name,
      previewUrl,
      links,
      customLinks,
      images,
      releaseDate,
      explicit,
      user: user._id,
      publicUrl: slug.toLowerCase().replace(/ /g, '-')
    }

    const newLink = new Link(link)
    const savedLink = await newLink.save()
    user.links = user.links.concat(savedLink._id)
    await user.save()

    return responseHandler(res, false, 201, 'Success', savedLink)
  } catch (err) {
    next(err)
  }
}

export const updateLink = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const updatedData = {
      ...req.body,
      publicUrl: req.body.slug
    }

    const link = await Link.findById(id)
    const user = await User.findById(userId)

    if (user.isAdmin === false && link.user.toString() !== userId) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    await Link.findByIdAndUpdate(id, updatedData, { returnOriginal: false })

    return responseHandler(res, false, 204, 'Link updated successfully')
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const deleteLink = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id
  try {
    const link = await Link.findById(id)
    const user = await User.findById(userId)

    if (user.isAdmin === false && link.user.toString() !== userId) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    await Link.findByIdAndDelete(id)
    return responseHandler(res, false, 204, 'Link deleted successfully.')
  } catch (err) {
    next(err)
  }
}

export const findLinkMostPopular = async (req, res, next) => {
  try {
    const user = req.user

    const searchUser = await User.findById(user.id)

    if (!searchUser.isAdmin) {
      const link = await Link.find({ userId: searchUser._id }).sort({ visits: -1 })
      return responseHandler(res, false, 200, 'Success', link)
    }

    const result = await Link.find().sort({ visits: -1 })
    return responseHandler(res, false, 200, 'Success', result)
  } catch (err) {
    next(err)
  }
}
