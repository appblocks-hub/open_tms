import { shared } from '@appblocks/node-sdk'

/**
 * 
* @swagger * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http *       scheme: bearer
 *       bearerFormat: JWT *
 * @swagger * paths:
 *   /open_tms_backend/open_tms_create_tickets:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       summary: Create a new ticket.
 *       description: Create a new ticket in the system.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 department:
 *                   type: string
 *                 description:
 *                   type: string
 *                 ticket_type:
 *                   type: string
 *       responses:
 *         '201':
 *           description: Created 
 *           content:
 *             application/json:
 *               example: { message: 'Ticket created successfully' }
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example: { message: 'Bad Request, one or more required values missing' }
 *         '401':
 *           description: Unauthorized 
 *           content:
 *             application/json:
 *               example: { message: 'Unauthorized!' }
 *         '500':
 *           description: Internal Server Error 
 *           content:
 *             application/json:
 *               example: { message: 'Whoops!, an error occurred while processing the request' }
 */


const allRequiredSet = (scope, ...properties) =>
  scope && (!properties || properties.every(key => !key || key in scope))

async function getStageIdByName(stageName) {
  const { prisma } = await shared.getShared()

  // Retrieves the unique identifier (ID) associated with a specific stage name from a database table
  const stage = await prisma.stage.findUnique({
    where: { name: stageName },
  });
  return stage.id;
}

async function getOrganizationId(userID) {
  const { prisma } = await shared.getShared()

  const queryResult = await prisma.$queryRaw`
        SELECT om.organisation_id
        FROM org_member_roles AS omr
        JOIN org_member AS om ON omr.user_id = om.created_by
        WHERE omr.user_id = ${userID};
      `;

  if (queryResult[0]) {
    const organisation_id = queryResult[0].organisation_id;
    return organisation_id;
  } else {
    console.error('User not found in org_member_roles.');
    return null
  }
}

const handler = async (event) => {
  const { sendResponse, prisma } = await shared.getShared()

  const { req, res } = event

  try {

    // Perform Health check
    if (req.params.health === 'health') {
      sendResponse(res, 400, { message: 'Health check success' })
    }

    // User context from authentication middleware
    const creator_id = req?.user?.id
    if (!creator_id) {
      return sendResponse(res, 401, { message: "Unauthorized!" })
    }
    const organisation_id = getOrganizationId(creator_id)


    if (req?.body && allRequiredSet(req?.body, "name", "department", "description", "ticket_type")) {

      return await prisma.$transaction(async (tx) => {

        // Create an entry in the tickets table
        const ticket = await prisma.ticket.create({
          data: {
            created_by: creator_id,
            organisation_id
          },
        });

        // Add descrption metadata for ticket
        await prisma.org_member.create({
          data: {
            name: req.body.name,
            type: parseInt(req.body.ticket_type),
            created_by: creator_id,
            organisation_id: organisation_id,
          }
        })

        // Create a ticket revision for the ticket
        await prisma.ticket_revision.create({
          data: {
            department: req.body.department,
            ticket_id: ticket.id,
            description: req.body.description,
            created_by: creator_id,
            title: req.body.name,
          },
        });

        // Create a log entry in the ticket_activity table
        const stageName = 'ticket_raised'; // Name of the stage
        const currentStageId = await getStageIdByName(stageName);
        await prisma.ticket_activity.create({
          data: {
            ticket_revision_id: ticket.id,
            remark: req.body.description,
            created_by: creator_id,
            current_stage: currentStageId,
          },
        });

        const response = {
          id: ticket.id,
        }
        return sendResponse(res, 201, response, { message: 'Ticket created successfully' })
      })

    }
    return sendResponse(res, 400, { message: 'Bad Request, one or more required values missing ' })


  } catch (err) {
    console.error("Error encountered!: ", err);
    return sendResponse(res, err.errorCode, {
      message: " Whoops!, an error occurred while processing the request",
    });
  }
}

export default handler