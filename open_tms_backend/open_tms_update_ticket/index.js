import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse } = await shared.getShared()

  // health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' })
  }

  // get the ticket ID to update
  const ticketId = req.params.ticketId

  // update the ticket in Appblocks
  await shared.updateTicket({
    id: ticketId,
    status: 'closed',
  })
  
  return sendResponse(res, 200, { message: 'Updated ticket successfully' })
}

export default handler
