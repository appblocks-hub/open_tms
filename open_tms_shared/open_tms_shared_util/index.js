import HTTP_STATUS_CODES from './utils/httpStatusCodes.js'
import { sendMail } from './utils/emailService.js'
import generateRandomString from './utils/generateRandomString.js'
import redis from './utils/redis.js'

/**
 * Function to format and send response
 * @param {*} res
 * @param {*} code
 * @param {*} data
 * @param {*} type
 */
const sendResponse = (res, code, data, type = 'application/json') => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Content-Type': type,
  }

  res.writeHead(code, headers)
  res.write(JSON.stringify(data))
  res.end()
}

const checkHealth = (req, res) => {
  if (req.params.health === 'health') {
    sendResponse(res, 200, { success: true, message: 'Health check success' })
    return true
  }
  return false
}

const isEmpty = (value) => {
  if (value === null) {
    return true
  }
  if (typeof value !== 'number' && value === '') {
    return true
  }
  if (typeof value === 'undefined' || value === undefined) {
    return true
  }
  if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true
  }
  return false
}

export default {
  redis,
  sendResponse,
  checkHealth,
  isEmpty,
  HTTP_STATUS_CODES,
  sendMail,
  generateRandomString,
}
