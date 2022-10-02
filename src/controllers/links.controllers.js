import Link from '../models/links.model.js'
import User from '../models/users.model.js'
import { customLabels } from '../utils/customLabels.utils.js'
import { responseHandler } from '../utils/responseHandler.utils.js'

export const getLinks = async (req, res, next) => {
  const { page = 1, limit, track, slug, owner } = req.query
  const { user } = req

  try {
    // search user in db
    const searchUser = await User.findById(user.id)

    /// if user not found return unauthorized
    if (!searchUser) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    // if user is not admin restrict search to user links
    if (!searchUser.isAdmin) {
      // if user is not admin and track or artist name is provided
      if (track) {
        const links = await Link.find({
          $text: { $search: track },
          user: user.id
        })
          .limit(limit * 1)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .exec()
        const count = await Link.count({
          $text: { $search: track },
          user: user.id
        })

        const data = {
          data: links,
          totalResults: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }

        return responseHandler(res, false, 200, 'Success', data)
      }
      // if user is not admin and slug is provided
      if (slug) {
        const links = await Link.find({ publicUrl: slug, user: user.id })
          .limit(limit * 1)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .exec()

        const count = await Link.count({ publicUrl: slug, user: user.id })

        const data = {
          data: links,
          totalResults: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }

        return responseHandler(res, false, 200, 'Success', data)
      }
      // if user is not admin and request all links
      const links = await Link.find({ user: searchUser._id })
        .limit(limit * 1)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .exec()
      const count = await Link.count({ user: user.id })

      const data = {
        data: links,
        totalResults: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }

      return responseHandler(res, false, 200, 'Success', data)
    }

    // if user is admin and track or artist name is provided
    if (track) {
      const links = await Link.find({ $text: { $search: track } })
        .limit(limit * 1)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .exec()

      const count = await Link.count({ $text: { $search: track } })

      const data = {
        data: links,
        totalResults: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }

      return responseHandler(res, false, 200, 'Success', data)
    }

    // if user is admin and slug or owner id is provided
    if (slug || owner) {
      const links = await Link.find({
        $or: [{ user: owner }, { publicUrl: slug }]
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Link.count({
        $or: [{ user: owner }, { publicUrl: slug }]
      })

      const data = {
        data: links,
        totalResults: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }

      return responseHandler(res, false, 200, 'Success', data)
    }

    // if user is admin and request all links
    const links = await Link.find({})
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .exec()

    const count = await Link.count({})

    const data = {
      data: links,
      totalResults: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    }

    return responseHandler(res, false, 200, 'Success', data)
  } catch (err) {
    next(err)
  }
}

export const getSingleLink = async (req, res, next) => {
  const { id } = req.params

  const { user } = req

  try {
    // search user in db and link
    const searchUser = await User.findById(user.id)
    const link = await Link.findById(id)

    // if user not found return unauthorized
    if (!searchUser) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    // if user is not the owner or isn't admin return unauthorized
    if (
      searchUser._id.toString() !== link.user.toString() &&
      !searchUser.isAdmin
    ) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    if (!link) {
      return responseHandler(res, true, 404, 'Link not found')
    }

    return responseHandler(res, false, 200, 'Success', link)
  } catch (err) {
    next(err)
  }
}

export const saveLink = async (req, res, next) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    const {
      artists,
      name,
      previewUrl,
      links,
      customLinks,
      images,
      releaseDate,
      explicit,
      slug
    } = req.body

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
  const user = req.user.id

  try {
    const updatedData = {
      ...req.body,
      publicUrl: req.body.slug
    }

    const link = await Link.findById(id)
    const searchUser = await User.findById(user)

    if (!searchUser) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    if (
      searchUser._id.toString() !== link.user.toString() &&
      !searchUser.isAdmin
    ) {
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
  const user = req.user.id
  try {
    const link = await Link.findById(id)
    const searchUser = await User.findById(user)

    if (!searchUser) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    if (
      searchUser._id.toString() !== link.user.toString() &&
      !searchUser.isAdmin
    ) {
      return responseHandler(res, true, 401, 'Unauthorized')
    }

    await Link.findByIdAndDelete(id)
    return responseHandler(res, false, 204, 'Link deleted successfully.')
  } catch (err) {
    next(err)
  }
}

export const findLinkMostPopular = async (req, res, next) => {
  const { page, limit, name, slug, artists, owner } = req.query
  const { user } = req

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: { visits: -1 },
    customLabels
  }
  try {
    const searchUser = await User.findById(user.id)

    if (!searchUser.isAdmin) {
      const link = await Link.paginate(
        {
          $or: [
            { userId: user.id },
            { name },
            { publicUrl: slug },
            { artists }
          ]
        },
        options
      )
      return responseHandler(res, false, 200, 'Success', link)
    }

    const data = await Link.paginate(
      { $or: [{ userId: owner }, { name }, { publicUrl: slug }, { artists }] },
      options
    )

    return responseHandler(res, false, 200, 'Success', data)
  } catch (err) {
    next(err)
  }
}
