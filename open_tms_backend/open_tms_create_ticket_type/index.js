import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event
  try {
    const { sendResponse } = await shared.getShared()
    console.log('req ', req.params)
    // health check
    if (req.params.health === 'health') {
      return sendResponse(res, 200, { message: 'Health check success' })
    }

    /**
     * Add create ticket type logic here
     */

    return sendResponse(res, 200, { message: 'Successfully created ticket type' })
  } catch (e) {
    console.log(e)
  }
  return res.status(500)
}

export default handler
