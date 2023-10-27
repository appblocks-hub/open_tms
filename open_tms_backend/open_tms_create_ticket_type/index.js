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
 * /open_tms_backend/open_tms_create_ticket_type:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create ticket type
 *     description: This function will create new ticket type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 description: Ticket type name
 *                 example: dsbcndjA28
 *     responses:
 *       '201':
 *         description: Deleted
 *       '200':
 *         description: Ok
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */

const handler = async (event) => {
  try {
    const { req, res } = event
    const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth } = await shared.getShared();
    const logged_in_user_id = req.user.id;
    const label = req.body.label;

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    if (isEmpty(req.body.label)) {
      return sendResponse(res, 400, {
        message: "Please provide valid input",
      });
    }

    const loggedInUser = await prisma.$queryRaw`
        SELECT org_member.organisation_id
        FROM public.org_member
        INNER JOIN public.org_member_roles ON org_member.id = org_member_roles.id
        INNER JOIN public.roles ON org_member_roles.role_id = roles.id
        WHERE org_member_roles.user_id = ${logged_in_user_id}
        AND roles.name = 'role-assignee'
     `;

    if (!loggedInUser.length > 0) {
      return sendResponse(res, 401, {
        message: "Unauthorized access",
      });
    }

    const ticketType = await prisma.ticket_types.findFirst({
      where: {
        organisation_id: loggedInUser[0].organisation_id,
        label: {
          contains: label.replace(/\s/g, ''), // Remove all whitespace characters
          mode: 'insensitive',
        },
      }
    });

    if (ticketType) {
      return sendResponse(res, 400, {
        message: "Ticket type already exists.",
      });
    }
    const ticketData = {
      organisation_id: loggedInUser[0].organisation_id,
      created_by: logged_in_user_id,
      label
    }

    await prisma.ticket_types.create({
      data: ticketData,
    });

    return sendResponse(res, 200, { message: 'Successfully created ticket type' })
  } catch (err) {
    return sendResponse(res, 500, {
      message: "Something went wrong.",
    });
  }
}

export default handler
