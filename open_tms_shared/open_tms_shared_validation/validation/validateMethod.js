const validateRequestMethod = (req, allowedMethods = ['*']) => {
  if (allowedMethods.includes('*') || allowedMethods.includes(req.method)) {
    return
  }
  // Request method is not allowed
  const error = new Error('An error occurred.')
  error.errorCode = 405
  throw error
}

export default validateRequestMethod
