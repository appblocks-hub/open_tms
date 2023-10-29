import { shared } from '@appblocks/node-sdk'
// eslint-disable-next-line import/extensions
import validatIncomingRequestBody from './validator.js'

/**
 * @swagger
 * /open_tms_backend/open_tms_update_ticket:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing ticket
 *     tags:
 *       - ticket
 *     description: Update an existing ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: string
 *                 description: The ticket id
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *               to_stage:
 *                 type: string
 *                 description: The stage id to be updated
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *               assignee_id:
 *                 type: string
 *                 description: The assignee id to be updated
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *               remarks:
 *                 type: string
 *                 description: remarks while rejecting a ticket
 *                 required: false
 *                 example: "Ticket rejected"
 *               name:
 *                 type: string
 *                 description: title to be updated in case ticket is revised
 *                 required: false
 *                 example: Issue fixed
 *               description:
 *                 type: string
 *                 description: description to be updated in case ticket is revised
 *                 example: The ticket has been resolved
 *     responses:
 *       '201':
 *         description: Updated
 *       '200':
 *         description: Ticket updated successfully
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

    const { ticket_id, to_stage, assignee_id, remarks, name, description } = req.body

    const getLatestTicketRevision = await prisma.$queryRaw`
    SELECT pp.from_stage, pp.to_stage, tr.id as ticket_revision_id, p.id as process_id FROM ticket_revision tr
    INNER JOIN process p on tr.process_id = p.id
    INNER JOIN process_path pp on pp.process_id = p.id
    INNER JOIN ticket_activity ta on ta.ticket_revision_id = tr.id
    WHERE tr.ticket_id = ${ticket_id} and pp.name = 'ticket_raised_to_ticket_revised'
    limit 1`

    const getAssignedOrganisationMember = await prisma.$queryRaw`
        SELECT du.org_member_id as assignee_id FROM department_users du
        WHERE org_member_id = ${assignee_id}
        limit 1`

    if (
      to_stage !== getLatestTicketRevision?.[0]?.to_stage ||
      !getLatestTicketRevision?.length ||
      !getAssignedOrganisationMember?.length
    ) {
      return sendResponse(res, 400, {
        meta: {
          status: 400,
          message: 'Bad Request',
        },
        errors: [
          {
            code: 'BAD_REQUESt',
            message: 'Next stage or assignee is invalid.',
          },
        ],
      })
    }

    let newlyCreatedTicketActivity = {}
    let newlyCreatedTicketRevision = {}
    await prisma.$transaction(async (tx) => {
      await tx.ticket_activity.create({
        data: {
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date(),
          assignee_id,
          current_stage: to_stage,
          remark: null,
          ticket_revision_id: getLatestTicketRevision?.[0]?.ticket_revision_id,
        },
      })
      if (name?.length && description?.length) {
        newlyCreatedTicketRevision = await tx.ticket_revision.create({
          data: {
            ticket_id,
            title: name,
            description,
            created_by: userId,
            created_at: new Date(),
            updated_at: new Date(),
            process_id: getLatestTicketRevision?.[0]?.process_id,
          },
        })
        newlyCreatedTicketActivity = await tx.ticket_activity.create({
          data: {
            created_by: userId,
            updated_by: userId,
            created_at: new Date(),
            updated_at: new Date(),
            assignee_id,
            current_stage: to_stage,
            remark: remarks,
            ticket_revision_id: newlyCreatedTicketRevision?.id,
          },
        })
      }
    })

    return sendResponse(res, 200, {
      meta: {
        status: 200,
        message: 'Ticket updated succesfully',
      },
      data: {
        ticket_id,
        ticket_revision_id: newlyCreatedTicketRevision?.id,
        ticket_activity_id: newlyCreatedTicketActivity?.id,
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
