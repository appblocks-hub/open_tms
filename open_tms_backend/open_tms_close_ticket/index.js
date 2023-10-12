import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse } = await shared.getShared()

  // health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' })
  }
  console.log(req.user)
  console.log(req.body)
  /**
   * Add close ticket logic here
   */

  return sendResponse(res, 200, { message: 'Successfully closed ticket' })
}

export default handler
