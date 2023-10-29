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
 * /open_tms_backend/open_tms_update_ticket_type:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Update ticket type
 *     description: This function will update ticket type details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_type_id:
 *                 type: string
 *                 description: The type id
 *                 example: dsbcndjA28
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
    const ticket_type_id = req.body.ticket_type_id;
    const logged_in_user_id = req.user.id;

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    if (isEmpty(ticket_type_id) || isEmpty(req.body.label)) {
      return sendResponse(res, 400, {
        message: "Please provide valid input",
      });
    }

    const loggedInUser = await prisma.$queryRaw`
  SELECT
    CASE
     WHEN EXISTS (
        SELECT 1
        FROM public.org_member_roles
        INNER JOIN public.roles ON org_member_roles.role_id = roles.id
        WHERE org_member_roles.user_id = ${logged_in_user_id}
        AND roles.name = 'role-assignee'
      ) THEN true
      ELSE false
    END AS isAdmin;`;

    const isAdmin = loggedInUser[0]?.isadmin || false;
    if (!isAdmin) {
      return sendResponse(res, 401, {
        message: "Unauthorized access",
      });
    }

    const ticketType = await prisma.ticket_types.findFirst({
      where: {
        id: ticket_type_id,
      },
    });

    if (!ticketType) {
      return sendResponse(res, 400, {
        message: "Ticket type id is invalid.",
      });
    }

    await prisma.ticket_types.update({
      where: {
        id: ticket_type_id,
      },
      data: {
        label: req.body.label,
        updated_by: req.user.id
      },
    });

    return sendResponse(res, 200, { message: 'Successfully updated ticket type' })
  } catch (err) {
    return sendResponse(res, 500, {
      message: "Something went wrong.",
    });
  }
}

export default handler
