/**
 * @swagger
 * /open_tms_middleware/open_tms_response_handler:
 *     summary: Response handler middleware
 *     description: Middleware for managing and manipulating success and error responses to reduce code duplication and achieve uniformity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               req:
 *                 type: object
 *                 description: The Express request object
 *               res:
 *                 type: object
 *                 description: The Express response object
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized Access
 *       '500':
 *         description: Internal Server Error
 */

const ErrorResBuilder = (status, message, customMessage, code) => ({
  meta: {
    status,
    message,
  },
  errors: [
    {
      code,
      message: customMessage || message,
    },
  ],
})

const commonErrors = (statusCode, customMessage) => {
  const errors = {
    500: ErrorResBuilder(500, 'Something went wrong.', customMessage, 'INTERNAL_ERROR'),
    400: ErrorResBuilder(400, 'Bad Request', customMessage, 'BAD_REQUEST'),
    401: ErrorResBuilder(400, 'Unauthorized access', customMessage, 'AUTH_FAILED'),
    404: ErrorResBuilder(400, 'Not Found', customMessage, 'NOT_FOUND'),
  }
  return errors[statusCode] || errors[500]
}

const handler = async (event) => {
  const { res } = event

  res.successResponse = (data, message, statusCode = 200) => {
    const successResponseObject = {
      meta: { status: statusCode, ...(message && { message }) },
      ...(data && { data }),
    }
    res.status(statusCode).json(successResponseObject)
  }

  res.errorResponse = (statusCode = 500, error = '') => {
    const errorMessage = error.message ? error.message : error
    const responseJson = commonErrors(statusCode, errorMessage)
    const env = process.env.BB_OPEN_TMS_ENVIRONMENT || 'development'
    if (env === 'development') console.error('Error :', error)
    return res.status(statusCode).json(responseJson)
  }

  return true
}

export default handler
