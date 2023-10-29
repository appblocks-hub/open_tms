/**
 * @swagger
 * /open_tms_backend/open_tms_get_ticket_activity_logs
 *   get:
 *     summary: Get ticket activity
 *     description: Retrieve activity data for a specific ticket.
 *     parameters:
 *       - in: query
 *         name: ticket_id
 *         schema:
 *           type: string/UUID
 *         required: true
 *         description: The ID of the ticket to retrieve activity data for.
 *     responses:
 *       '200':
 *         description: Successful response with ticket activity data.
 *         content:
 *           application/json:
 *             example:
 *               - id: "828cb639-9592-40f9-ad8d-90b27570ff47"
 *                 to_stage:
 *                   id: "b6de2027-250c-4757-b8a7-8a4f97a7ff5b"
 *                   name: "ticket_raised"
 *                 created_dt: "2023-10-28T06:22:46.147"
 *                 description: "Sample Ticket 2 Description1"
 *       '400':
 *         description: Bad Request or Invalid Ticket ID.
 *         content:
 *           application/json:
 *             example:
 *               message: "Provide a valid ticket_id"
 *       '422':
 *         description: Unprocessable Entity (Invalid UUID format).
 *         content:
 *           application/json:
 *             example:
 *               message: "ticket id must be in UUID format"
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "An error occurred while processing the request"
 *       '401':
 *         description: Unauthorized (Health Check Failed).
 *         content:
 *           application/json:
 *             example:
 *               message: "Health check succeeded"
 */

import { shared } from '@appblocks/node-sdk'

const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi

const handler = async (event) => {
  const { req, res } = event
  const { prisma, validateRequestMethod, validateRequestBody } = await shared.getShared()
  await validateRequestMethod(req, ['GET'])

  try {
    // health check
    if (req.params.health === 'health') return res.successResponse(null, 'Health check succeeded', 200)

    const requestBody = req.body

    // if we are going to use express validator then we can check isUUID for ticket id validation
    const requiredFields = ['ticket_id']
    const validationError = validateRequestBody(requiredFields, req.body)
    if (validationError) return res.errorResponse(400, validationError)
    if (!regexExp.test(requestBody.ticket_id)) return res.errorResponse(422, 'ticket id must be UUID format')

    const activity = await prisma.$queryRaw`
    SELECT  
      ta.id,
      json_build_object('id', s.id, 'name', s.name) AS to_stage,
      ta.created_at,
      tr.description
    FROM ticket_activity ta
    JOIN ticket_revision tr ON ta.ticket_revision_id = tr.id
    JOIN stage s ON ta.current_stage = s.id
    WHERE tr.ticket_id = ${requestBody.ticket_id}
    ORDER BY ta.created_at ASC;`

    if (!activity.length) return res.errorResponse(400, 'Provide a valid ticket_id')

    return res.successResponse(activity, 'Ticket data retrieved successfully')
  } catch (error) {
    return res.errorResponse(500, error)
  }
}

export default handler
