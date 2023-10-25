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
 * /open_tms_backend/open_tms_get_ticket_activity_logs:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve ticket activity logs for a ticket in the Ticket Management System (TMS)
 *     description: Retrieve ticket activity logs for a ticket in the Ticket Management System (TMS).
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
 *         description: Ticket data retrieved successfully
 *       '401':
 *         description: Auth failed
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Something went wrong
 */

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, prisma, isEmpty } = await shared.getShared()

  try {
    // health check
    if (req.params.health === 'health') {
      return sendResponse(res, 200, { message: 'Health check success' })
    }

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

    const activity = await prisma.$queryRaw`
      SELECT ticket_activity.id,ticket_activity.created_at,ticket_revision.description,stage.name as stage_name, stage.id as stage_id
      FROM ticket_activity
      JOIN ticket_revision ON ticket_activity.ticket_revision_id = ticket_revision.id
      JOIN stage ON ticket_activity.current_stage = stage.id
      WHERE ticket_revision.ticket_id = ${requestBody.ticket_id}
      ORDER BY ticket_activity.created_at ASC;
      `

    if (!activity.length) {
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

    const result = activity.map((act) => ({
      id: act.id,
      to_stage: {
        id: act.stage_id,
        name: act.stage_name,
      },
      created_dt: act.created_at,
      description: act.description,
    }))

    return sendResponse(res, 200, {
      meta: {
        status: 200,
        message: 'Ticket data retrieved successfully',
      },
      data: result,
    })
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
}

export default handler
