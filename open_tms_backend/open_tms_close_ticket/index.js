import { shared } from '@appblocks/node-sdk'
import { Ticket, TicketRevision, TicketActivity } from './models'

const validateProcessPath = (currentStage, nextStage, assignee) => {
  const processPath = {
    open: ['in_progress'],
    in_progress: ['resolved', 'closed'],
    resolved: ['closed'],
  }

  if (processPath[currentStage] && processPath[currentStage].includes(nextStage)) {
    if (nextStage === 'closed' && assignee !== currentAssignee) {
      return false
    }
    return true
  }
  return false
}

const closeTicket = async (ticketId) => {
  const latestRevision = await TicketRevision.findOne({
    where: { ticketId },
    order: [['id', 'DESC']],
  })

  if (validateProcessPath(latestRevision.currentStage, 'ticket_closed', latestRevision.assignee)) {
    const ticket = await Ticket.findByPk(ticketId)
    ticket.status = 'closed'
    await ticket.save()

    const activity = await TicketActivity.create({
      ticketId,
      currentStage: 'ticket_closed',
    })

    return { success: true, activity }
  } else {
    throw new Error('Next stage or assignee is invalid.')
  }
}

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse } = await shared.getShared()

  // health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' })
  }

  console.log(req.user)
  console.log(req.body)

  try {
    const { ticket_id } = req.body
    const { success, activity } = await closeTicket(ticket_id)

    if (success) {
      return sendResponse(res, 200, { meta: { status: 200, message: 'Ticket closed successfully' }, activity })
    }
  } catch (error) {
    // Capture errors and send appropriate error messages based on the response structure to the frontend
    if (error.message === 'Next stage or assignee is invalid.') {
      return sendResponse(res, 400, {
        meta: { status: 400, message: 'Bad Request' },
        errors: [{ code: 'BAD_REQUEST', message: 'Next stage or assignee is invalid.' }],
      })
    } else {
      return sendResponse(res, 500, {
        meta: { status: 500, message: 'Something went wrong.' },
        errors: [{ code: 'INTERNAL_ERROR', message: 'Something went wrong.' }],
      })
    }
  }

  return sendResponse(res, 200, { message: 'Successfully closed ticket' })
}

export default handler