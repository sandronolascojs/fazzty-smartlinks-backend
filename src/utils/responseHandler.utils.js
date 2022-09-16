export const responseHandler = (res, error, status, message, data) => {
  res.status(status).json({
    error,
    code: status,
    message,
    data: data || null
  })
}
