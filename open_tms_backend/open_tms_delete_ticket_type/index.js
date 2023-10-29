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
 * /open_tms_backend/open_tms_delete_ticket_type:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete ticket type
 *     description: Delete ticket type.
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

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    if (isEmpty(ticket_type_id)) {
      return sendResponse(res, 400, {
        message: "Please provide ticket type id",
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

    const associatedTickets = await prisma.ticket.findMany({
      where: {
        ticket_type_id,
      },
    });

    if (associatedTickets?.length > 0) {
      return sendResponse(res, 400, {
        message: "Cannot delete this ticket type; it is associated with tickets.",
      });
    } else {
      // If there are no associated tickets, delete the ticket type
      await prisma.ticket_types.delete({
        where: {
          id: ticket_type_id,
        },
      });

      return sendResponse(res, 200, { message: 'Successfully deleted ticket type' });
    }
  } catch (err) {
    return sendResponse(res, 500, {
      message: "Something went wrong.",
    });
  }
}

export default handler;
