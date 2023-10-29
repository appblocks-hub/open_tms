import { shared } from '@appblocks/node-sdk'
/**
 * @swagger
 * /open_tms_backend/open_tms_create_ticket:
 *   post:
 *     summary: Create a Ticket
 *     description: Create a new ticket with the specified details.
 *     requestBody:
 *       description: Ticket details to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the ticket.
 *               department:
 *                 type: string
 *                 description: The department of the ticket.
 *               description:
 *                 type: string
 *                 description: The description of the ticket.
 *               ticket_type:
 *                 type: integer
 *                 description: The type of the ticket.
 *             required:
 *               - name
 *               - department
 *               - description
 *               - ticket_type
 *     responses:
 *       '200':
 *         description: Successful response with the created ticket ID and revision ID.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 200
 *                 message: "Ticket created successfully"
 *               data:
 *                 id: "828cb639-9592-40f9-ad8d-90b27570ff47"
 *                 revision_id: "b6de2027-250c-4757-b8a7-8a4f97a7ff5b"
 *       '400':
 *         description: Bad Request with an error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 400
 *                 message: "Bad Request"
 *               errors:
 *                 - code: "BAD_REQUEST"
 *                   message: "Bad Request"
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
 *       '404':
 *         description: Not Found with an error response.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 404
 *                 message: "Stage name not found"
 *               errors:
 *                 - code: "NOT_FOUND"
 *                   message: "Stage name not found"
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

const { prisma, validateRequestBody, validateRequestMethod } = await shared.getShared()

const STAGE_NAME = 'ticket_raised'

async function findStageIdByName(stageName) {
  const stage = await prisma.stage.findUnique({
    where: { name: stageName },
  })
  return stage.id
}

async function findOrganizationId(userID) {
  /* I didn't find a direct relationship between users and organizations, 
   so I linked them using the "created_by" field. This allows the member who created the organization to also create a ticket. */
  const queryResult = await prisma.$queryRaw`
    SELECT om.organisation_id
    FROM org_member_roles AS omr
    JOIN org_member AS om ON omr.user_id = om.created_by
    WHERE omr.user_id = ${userID};`
  if (!queryResult[0]) {
    console.error('User not found in org_member_roles.')
    return null
  }
  return queryResult[0].organisation_id
}

const handler = async (event) => {
  const { req, res } = event
  await validateRequestMethod(req, ['POST'])

  if (req.params.health === 'health') {
    return res.successResponse(null, 'Health check succeeded', 200)
  }

  // can we try express validator kind of packages ? for now using simple validator
  const requiredFields = ['name', 'department', 'description', 'ticket_type']
  const validationError = validateRequestBody(requiredFields, req.body)
  if (validationError) return res.errorResponse(400, validationError)

  const currentUserID = req?.user?.id
  if (!currentUserID) {
    return res.errorResponse(401)
  }
  const { name, description, ticket_type } = req.body
  /*
  const { department } = req.body
  I'm not sure about the purpose of the "ticket_type" key, so for now, 
  I'm utilizing it like org_member type. If it's meant for something specific, we could consider creating another table or clarifying its use. Did I miss any information regarding this? 
  additionally i couldn't find connection between ticket and department.
  */

  const orgId = await findOrganizationId(currentUserID)
  try {
    return await prisma.$transaction(async () => {
      const ticket = await prisma.ticket.create({
        data: {
          created_by: currentUserID,
          organisation_id: orgId,
        },
      })
      await prisma.org_member.create({
        data: {
          name,
          created_by: currentUserID,
          type: parseInt(ticket_type, 10),
          organisation_id: orgId,
        },
      })
      if (!ticket?.id) throw new Error('Something went wrong while ticket creation')

      const ticketRevisionDetails = await prisma.ticket_revision.create({
        data: {
          ticket_id: ticket?.id,
          description,
          created_by: currentUserID,
          title: name,
        },
      })
      if (!ticketRevisionDetails.id) throw new Error('Something went wrong while ticket creation')

      const currentStageId = await findStageIdByName(STAGE_NAME)
      if (!currentStageId) return res.errorResponse(404, 'Stage name not found')

      await prisma.ticket_activity.create({
        data: {
          ticket_revision_id: ticketRevisionDetails?.id,
          remark: description,
          created_by: currentUserID,
          current_stage: currentStageId,
        },
      })

      const response = { id: ticket?.id, revision_id: ticketRevisionDetails?.id }
      return res.successResponse(response, 'Ticket created successfully')
    })
  } catch (error) {
    return res.errorResponse(500, error)
  }
}

export default handler
