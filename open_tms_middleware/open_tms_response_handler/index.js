/**
 * @swagger
 * /open_tms_middleware/open_tms_response_handler
 *     summary: Response handler middleware
 *     description: Middleware for managing and manipulating success and error responses to reduce code duplication and achieve uniformity.
 *     responses:
 *       '200':
 *         description: Successful response with a sample success message.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 200
 *                 message: "Success"
 *               data: null
 *       '400':
 *         description: Bad Request with a sample error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 400
 *                 message: "Bad Request"
 *               errors:
 *                 - code: "BAD_REQUEST"
 *                   message: "Bad Request"
 *       '401':
 *         description: Unauthorized Access with a sample error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 401
 *                 message: "Unauthorized access"
 *               errors:
 *                 - code: "AUTH_FAILED"
 *                   message: "Unauthorized access"
 *       '404':
 *         description: Not Found with a sample error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 404
 *                 message: "Not Found"
 *               errors:
 *                 - code: "NOT_FOUND"
 *                   message: "Not Found"
 *       '422':
 *         description: Invalid Data Provided with a sample error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 422
 *                 message: "Invalid data provided"
 *               errors:
 *                 - code: "INVALID_DATA_PROVIDED"
 *                   message: "Invalid data provided"
 *       '500':
 *         description: Internal Server Error with a sample error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 500
 *                 message: "Something went wrong."
 *               errors:
 *                 - code: "INTERNAL_ERROR"
 *                   message: "Something went wrong."
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
    422: ErrorResBuilder(422, 'Invalid data provided', customMessage, 'INVALID_DATA_PROVIDED'),
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
