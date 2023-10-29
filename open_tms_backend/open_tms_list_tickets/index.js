import { shared } from '@appblocks/node-sdk'
/**
 * @swagger
 * /open_tms_backend/open_tms_list_tickets:
 *   get:
 *     summary: Retrieve User's Tickets
 *     description: Retrieve tickets associated with the user.
 *     responses:
 *       '200':
 *         description: Successful response with a list of user's tickets.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 200
 *                 message: "Retrieved tickets successfully"
 *               data:
 *                 - id: "828cb639-9592-40f9-ad8d-90b27570ff47"
 *                   name: "Sample Ticket"
 *                   description: "Sample Ticket Description"
 *       '401':
 *         description: Unauthorized Access with an error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 401
 *                 message: "Unauthorized access"
 *               errors:
 *                 - code: "AUTH_FAILED"
 *                   message: "Unauthorized access"
 *       '500':
 *         description: Internal Server Error with an error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 500
 *                 message: "Something went wrong."
 *               errors:
 *                 - code: "INTERNAL_ERROR"
 *                   message: "Something went wrong."
 */

const handler = async (event) => {
  const { req, res } = event
  const { prisma, validateRequestMethod } = await shared.getShared()
  try {
    await validateRequestMethod(req, ['GET'])
    if (req.params.health === 'health') {
      return res.successResponse(null, 'Health check success', 200)
    }
    const userID = req?.user?.id
    if (!userID) {
      return res.errorResponse(401)
    }
    const tickets = await prisma.$queryRaw`
    WITH org_m AS (
      SELECT o.id
      FROM org_member_roles o
      WHERE o.user_id = ${userID}
    )
    
    SELECT t.id, tr.*
    FROM ticket t
    INNER JOIN LATERAL (
      SELECT
        tr.title as name,
        tr.description
      FROM ticket_revision tr
      INNER JOIN ticket_activity ta ON tr.id = ta.ticket_revision_id
      INNER JOIN org_m ON org_m.id = ta.assignee_id
      WHERE tr.ticket_id = t.id
      ORDER BY tr.created_at DESC
      LIMIT 1
    ) tr ON TRUE;`
    return res.successResponse(tickets, 'Retrieved tickets successfully', 200)
  } catch (error) {
    return res.errorResponse(500, error)
  }
}
export default handler
