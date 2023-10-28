/**
 * @swagger
 * /open_tms_backend/open_tms_list_tickets:
 *   get:
 *     summary: Get current user ticket list
 *     description: to gel list of ticket that under current user
 *     responses:
 *       '200':
 *         message: Retrieved tickets successfully
 *         date : [list of tickets]
 */

import { shared } from '@appblocks/node-sdk'

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
