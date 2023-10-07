import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse } = await shared.getShared()

  // health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' })
  }

  /**
   * Add create department logic here
   */

  return sendResponse(res, 200, { message: 'Successfully created department' })
}

export default handler
