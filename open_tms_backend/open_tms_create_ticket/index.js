import { shared } from '@appblocks/node-sdk'
// eslint-disable-next-line import/extensions
import validatIncomingRequestBody from './validator.js'

/**
 * @swagger
 * /open_tms_backend/open_tms_create_ticket:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new ticket
 *     tags:
 *       - ticket
 *     description: Create a new ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The ticket name
 *                 example: Issue with device
 *               department:
 *                 type: string
 *                 description: The department id
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *               description:
 *                 type: string
 *                 description: Description for the ticket
 *                 example: I have an issue with my device
 *               ticket_type:
 *                 type: string
 *                 description: The ticket type id
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 */

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, prisma, checkHealth, validateRequestMethod, isEmpty } = await shared.getShared()

  try {
    // Check for valid request body
    if (checkHealth(req, res)) return {}
    await validateRequestMethod(req, ['POST'])
    const requestBody = req?.body
    const validationError = validatIncomingRequestBody(requestBody)

    // check if the request body is empty
    if (isEmpty(requestBody) || validationError) {
      return sendResponse(res, 400, {
        meta: {
          status: 400,
          message: 'Bad Request',
        },
        errors: [
          {
            code: 'BAD_REQUEST',
            message: 'Invalid request payload!',
          },
        ],
      })
    }

    const userId = req?.user?.id
    if (!userId) {
      return sendResponse(res, 401, {
        meta: {
          status: 401,
          message: 'Unauthorized access',
        },
        errors: [
          {
            code: 'AUTH_FAILED',
            message: 'Authentication failed for the request.',
          },
        ],
      })
    }
    const { name, department, description } = req.body

    const getOrganisation = await prisma.$queryRaw`
    SELECT o.id as organisation_id FROM organisation o
    INNER JOIN tenant t on t.id = o.tenant_id
    WHERE t.name = 'Appblocks'
    limit 1`

    const getTicketRaisedStage = await prisma.$queryRaw`
    SELECT s.id as ticket_stage_id, s.process_id FROM stage s
    INNER JOIN process p on s.process_id = p.id
    WHERE s.name = 'ticket_raised' and p.organisation_id = ${getOrganisation?.[0]?.organisation_id}
    limit 1`

    const getAssignedOrganisationMember = await prisma.$queryRaw`
        SELECT du.org_member_id as assignee_id FROM department_users du
        INNER JOIN roles r
        on r.id = du.role_id
        WHERE r.name = 'role-assignee' and du.department_id = ${department}
        limit 1`

    if (!getOrganisation?.length || !getTicketRaisedStage?.length || !getAssignedOrganisationMember?.length) {
      return sendResponse(res, 400, { message: 'Invalid organisation data!' })
    }

    let createdTicket = {}
    let createdTicketRevision = {}
    await prisma.$transaction(async (tx) => {
      createdTicket = await tx.ticket.create({
        data: {
          status: 0,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date(),
          organisation_id: getOrganisation?.[0]?.organisation_id,
        },
      })
      createdTicketRevision = await tx.ticket_revision.create({
        data: {
          ticket_id: createdTicket?.id,
          title: name,
          description,
          created_by: userId,
          created_at: new Date(),
          updated_at: new Date(),
          process_id: getTicketRaisedStage?.[0]?.process_id,
        },
      })
      await tx.ticket_activity.create({
        data: {
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date(),
          assignee_id: getAssignedOrganisationMember?.[0]?.assignee_id,
          current_stage: getTicketRaisedStage?.[0]?.ticket_stage_id,
          remark: null,
          ticket_revision_id: createdTicketRevision?.id,
        },
      })
    })

    return sendResponse(res, 200, {
      meta: {
        status: 200,
        message: 'Ticket created succesfully',
      },
      data: {
        id: createdTicket?.id,
        revision_id: createdTicketRevision?.id,
      },
    })
  } catch (error) {
    return sendResponse(res, 500, {
      meta: {
        status: 500,
        message: 'Something went wrong.',
      },
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong.',
        },
      ],
    })
  }
}

export default handler
