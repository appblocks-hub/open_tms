import { shared } from "@appblocks/node-sdk";

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
 * /open_tms_list_tickets:
 *   post:
 *     security:
 *       - bearerAuth: []
 *	   summary: Get the latest ticket revisions for a specific assignee.
 *     description: Retrieve the latest ticket revisions associated with a specific user (assignee).
 *       '200':
 *         description: Ok
 *       '404':
 *         description: No data found for the specified assigneeID.
 *       '500':
 *         description: An error occurred while processing the request.
 *     schemes:
 *       - http
 *       - https
 */

const handler = async (event) => {
  const { req, res } = event;
  const { sendResponse, prisma } = await shared.getShared();
  try {
    // Perform health check
    if (req.params.health === "health") {
      return sendResponse(res, 200, { message: "Health check succeeded" });
    }

    // Use user_id as assignee from the currently signed in user via the auth middleware
    const user_id = req?.user.id
    const tickets = await prisma.$queryRaw`
      SELECT t.id AS ticket_id, tr.*
      FROM ticket t
      INNER JOIN LATERAL (
        SELECT tr.id AS ticket_revision_id, tr.process_id, tr.title, tr.description
        FROM ticket_revision tr
        INNER JOIN ticket_activity ta ON tr.id = ta.ticket_revision_id
        INNER JOIN org_member_roles org_m ON org_m.id = ta.assignee_id
        WHERE tr.ticket_id = t.id
        AND org_m.user_id = ${user_id}
        ORDER BY tr.created_at DESC
      ) tr ON TRUE;
`

    return sendResponse(res, 200, tickets, { message: "Retrieved tickets successfully" });

  } catch (err) {
    console.error("Error encountered!: ", err);
    return sendResponse(res, err.errorCode ? err.errorCode : 500, {
      message: err.errorCode === 400 ? "No data found for the specified assigneeID" : " Whoops!, an error occurred while processing the request",
    });
  }
};

export default handler;
