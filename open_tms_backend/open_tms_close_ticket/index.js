import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketActivity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 123
 *         ticketId:
 *           type: integer
 *           example: 456
 *         currentStage:
 *           type: string
 *           example: ticket_closed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2022-01-01T00:00:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2022-01-01T00:00:00.000Z'
 */

/**
 * @swagger
 * /close-ticket:
 *   post:
 *     summary: Close a ticket
 *     description: Close a ticket and create a new entry in the ticket_activity table
 *     tags:
 *       - Tickets
 *     requestBody:
 *       description: Ticket ID to close
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 description: ID of the ticket to close
 *                 example: 123
 *     responses:
 *       200:
 *         description: Ticket closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: Ticket closed successfully
 *                 activity:
 *                   $ref: '#/components/schemas/TicketActivity'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 400
 *                     message:
 *                       type: string
 *                       example: Bad Request
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: BAD_REQUEST
 *                       message:
 *                         type: string
 *                         example: Next stage or assignee is invalid.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 500
 *                     message:
 *                       type: string
 *                       example: Something went wrong.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: INTERNAL_ERROR
 *                       message:
 *                         type: string
 *                         example: Something went wrong.
 */
const closeTicket = async (ticketId) => {
  const TicketRevision = await shared.import('open_tms', 'TicketRevision')
  const latestRevision = await TicketRevision.findOne({
    where: { ticketId },
    order: [['id', 'DESC']],
  })

  if (await validateProcessPath(latestRevision.currentStage, 'ticket_closed', latestRevision.assignee)) {
    const Ticket = await shared.import('open_tms', 'Ticket')
    const ticket = await Ticket.findByPk(ticketId)
    ticket.status = 'closed'
    await ticket.save()

    // Create a new entry in the ticket_activity table with current_stage as "ticket_closed" id from stage table
    const TicketActivity = await shared.import('open_tms', 'TicketActivity')
    const activity = await TicketActivity.create({
      TicketRevisionId: latestRevision.id,
      currentStage: 'ticket_closed',
    })

    return { success: true, activity }
  } else {
    // If validation fails, send proper error message
    throw new Error('Next stage or assignee is invalid.')
  }
}

const validateProcessPath = async (currentStage, nextStage, assignee) => {
  const ProcessPath = await shared.import('open_tms', 'ProcessPath')
  const processPath = await ProcessPath.findOne({
    where: { currentStage },
    include: { nextStages: true },
  })

  if (!processPath) {
    throw new Error(`Invalid current stage: ${currentStage}`)
  }

  const nextStageObj = processPath.nextStages.find((stage) => stage.name === nextStage)

  if (!nextStageObj) {
    return false
  }

  if (nextStageObj.assignee && nextStageObj.assignee !== assignee) {
    return false
  }

  return true
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