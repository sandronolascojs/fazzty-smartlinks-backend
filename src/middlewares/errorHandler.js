import { NODE_ENV } from '../config/envProcess.js'

export const errorHandler = (error, req, res, next) => {
  if (NODE_ENV === 'development') {
    return res.status(500).json({
      name: error.name,
      status: error.status,
      message: error.message,
      stack: error.stack
    })
  } else if (NODE_ENV === 'production') {
    next(error)
  }
}
