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
 *       '201':
 *         description: Created
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
    const assigneeID = req?.user?.id;
    // Get tickets from the `tickets`, `tickets_revisions` and `ticket_activity` tables
    const tickets = await prisma.$queryRaw`SELECT t.id AS ticket_id, tr.*
    FROM ticket t
    INNER JOIN (
      SELECT DISTINCT ON (t.id) t.id, tr.id AS ticket_revision_id, tr.process_id, tr.title, tr.description
      FROM ticket t
      JOIN ticket_activity ta ON t.id = ta.ticket_id
      JOIN org_member_roles o ON o.user_id = ta.assignee_id
      JOIN ticket_revision tr ON tr.id = ta.ticket_revision_id
      WHERE o.id = ${assigneeID}
      ORDER BY t.id, tr.created_at DESC
    ) tr ON t.id = tr.id;
`;
  //   const tickets = await prisma.$queryRaw`
  //   with org_m as (select o.id from org_member_roles o where o.user_id=${assigneeID})
  //   select t.id as ticket_id,tr.* from ticket t inner join lateral(
  //     select tr.id as ticket_revision_id,tr.process_id,tr.title,tr.description from ticket_revision tr inner join ticket_activity ta on 
  //         tr.id=ta.ticket_revision_id inner join org_m on org_m.id=ta.assignee_id
  //     where tr.ticket_id=t.id
  //     order by tr.created_at desc limit 1
  //     )tr on true`
  // return sendResponse(res, 200, tickets, { message: "Retrieved tickets successfully" });

  } catch (err) {
    console.error("Error encountered!: ", err);
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode === 400 ? "No data found for the specified assigneeID" : " Whoops!, an error occurred while processing the request",
    });
  }
};

export default handler;
