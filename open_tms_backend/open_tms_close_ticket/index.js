import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /open_tms_backend/open_tms_close_ticket:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: handle ticket closing in the Ticket Management System (TMS).
 *     description: handle ticket closing in the Ticket Management System (TMS).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: string
 *                 description: Ticket ID of the ticket to get the activity log
 *                 example: 9fc38479-1619-48d1-8aa6-996cff08a5bb
 *     responses:
 *       '200':
 *         description: Ticket closed successfully
 *       '401':
 *         description: Auth failed
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Something went wrong
 */

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, validateRequestMethod, prisma, isEmpty } = await shared.getShared()

  const TICKET_CLOSED_ID = '8be8ab00-d924-4be4-98ea-d126f7eccd7f' // stage id for ticket_closed
  const TICKET_CLOSED_STATUS = 1

  async function updateTicketAndCreateActivity(ticketId, userId, newStatus, currentStage, ticketRevisionId) {
    try {
      // Begin the transaction
      await prisma.$transaction([
        // Update the ticket table with closed status
        prisma.ticket.update({
          where: {
            id: ticketId,
          },
          data: {
            status: newStatus,
            updated_by: userId,
          },
        }),
        // Create a new entry in the ticket_activity table
        prisma.ticket_activity.create({
          data: {
            created_by: userId,
            ticket_revision_id: ticketRevisionId,
            current_stage: currentStage,
          },
        }),
      ])
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  try {
    // health check
    if (req.params.health === 'health') {
      return sendResponse(res, 200, { message: 'Health check success' })
    }

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty('ticket_id')) {
      return sendResponse(res, 400, {
        meta: {
          status: 400,
          message: 'Bad Request',
        },
        errors: [
          {
            code: 'Bad Request',
            message: 'Provide ticket_id in the request',
          },
        ],
      })
    }

    const [latestTicketActivity] = await prisma.$queryRaw`
    SELECT ta.*,
    tr.process_id
    FROM ticket_activity ta
        JOIN (
            SELECT id AS ticket_revision_id,
                process_id
            FROM ticket_revision
            WHERE ticket_id = ${requestBody.ticket_id}
            ORDER BY created_at DESC
            LIMIT 1
        ) tr ON ta.ticket_revision_id = tr.ticket_revision_id
    ORDER BY ta.created_at DESC
    LIMIT 1;
    `

    if (!latestTicketActivity) {
      return sendResponse(res, 400, {
        meta: {
          status: 400,
          message: 'Bad Request',
        },
        errors: [
          {
            code: 'Bad Request',
            message: 'Provide a valid ticket_id',
          },
        ],
      })
    }

    // Checking if the from stage and to stage exists in the specified process path.
    const [processPathExists] = await prisma.$queryRaw`
    SELECT *
    FROM process_path
    WHERE process_id = ${latestTicketActivity.process_id}
        AND from_stage = ${latestTicketActivity.current_stage}
        AND to_stage = ${TICKET_CLOSED_ID}
    `

    if (!processPathExists) {
      return sendResponse(res, 400, {
        meta: {
          status: 400,
          message: 'Bad Request',
        },
        errors: [
          {
            code: 'Bad Request',
            message: 'Not a valid stage to close the ticket.',
          },
        ],
      })
    }
    await updateTicketAndCreateActivity(
      requestBody.ticket_id,
      req?.user?.id,
      TICKET_CLOSED_STATUS,
      TICKET_CLOSED_ID,
      latestTicketActivity.ticket_revision_id
    )
  } catch (e) {
    return sendResponse(res, 500, {
      meta: {
        status: 500,
        message: 'Something went wrong.',
      },
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: e.message,
        },
      ],
    })
  }

  return sendResponse(res, 200, { message: 'Successfully closed ticket' })
}

export default handler
