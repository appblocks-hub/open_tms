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
 * /Examples/list_tickets:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve the list of tickets for the user
 *     description: Retrieve the list of tickets for the user.
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 *     schemes:
 *       - http
 *       - https
 */

const handler = async (event) => {
  const { req, res } = event
  try {
    const { sendResponse, prisma } = await shared.getShared()
    // health check
    if (req.params.health === 'health') {
      return sendResponse(res, 200, { message: 'Health check success' })
    }

    // getting user_id from req.user which is added to req object via auth middleware
    const assigneeID = req?.user?.id

    const tickets = await prisma.$queryRaw`
    with org_m as (select o.id from org_member_roles o where o.user_id=${assigneeID})
    select t.id as ticket_id,tr.* from ticket t inner join lateral(
      select tr.id as ticket_revision_id,tr.process_id,tr.title,tr.description from ticket_revision tr inner join ticket_activity ta on 
          tr.id=ta.ticket_revision_id inner join org_m on org_m.id=ta.assignee_id
      where tr.ticket_id=t.id
      order by tr.created_at desc limit 1
      )tr on true`

    return sendResponse(res, 200, { message: 'Successfully Retrieved tickets', data: tickets })
  } catch (err) {
    console.log('error is ', err)
  }
  return res.status(500)
}

export default handler
