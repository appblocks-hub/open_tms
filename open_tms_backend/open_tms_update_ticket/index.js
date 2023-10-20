import { shared } from '@appblocks/node-sdk';

const handler = async (event) => {
  const { req, res } = event;
  const { sendResponse, prisma } = await shared.getShared();

  // Health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' });
  }

  // Update Ticket Logic
  if (req.body.ticket_id && req.body.to_stage && req.body.assignee_id) {
    try {
      const {
        ticket_id,
        to_stage,
        assignee_id,
        remarks,
        name,
        description,
      } = req.body;

      // 2. Find the latest ticket revision
      const latestTicketRevision = await prisma.ticket_revision.findFirst({
        where: { ticket_id: ticket_id },
        orderBy: { created_at: "desc" },
      });

      // 3. Find the latest ticket activity for the latest ticket revision
      const latestTicketActivity = await prisma.ticket_activity.findFirst({
        where: { ticket_revision_id: latestTicketRevision.id },
        orderBy: { created_at: "desc" },
      });

      // 4. Find the current stage from ticket activity
      const currentStage = latestTicketActivity.current_stage;

      // 5. Validate the 'to_stage' and 'assignee_id' with the available process path from the current stage
      const processPath = await prisma.process_path.findFirst({
        where: {
          from_stage: currentStage,
          to_stage: to_stage,
        },
      });

      if (!processPath) {
        return sendResponse(res, 400, {
          meta: { status: 400, message: "Bad Request" },
          errors: [
            {
              code: "BAD_REQUEST",
              message: "Next stage or assignee is invalid.",
            },
          ],
        });
      }

      // 6. Add one entry to the 'ticket_activity' table with the 'to_stage' and 'assignee_id' data.
      const newTicketActivity = await prisma.ticket_activity.create({
        data: {
          created_by: req.user.id,
          current_stage: to_stage,
          assignee_id: assignee_id,
          ticket_revision_id: latestTicketRevision.id,
          remark: remarks,
        },
      });

      // 7. If the ticket needs to be revised, create a new entry in the 'ticket_revision' table
      if (name || description) {
        const newTicketRevision = await prisma.ticket_revision.create({
          data: {
            title: name || latestTicketRevision.title,
            description: description || latestTicketRevision.description,
            created_by: req.user.id,
            process_id: latestTicketRevision.process_id,
            ticket_id: ticket_id,
          },
        });
      }

      // 8. Return success message
      return sendResponse(res, 200, {
        meta: {
          status: 200,
          message: "Ticket updated successfully",
        },
        data: {
          ticket_id: ticket_id,
          ticket_revision_id: newTicketRevision?.id || latestTicketRevision.id,
          ticket_activity_id: newTicketActivity.id,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      return sendResponse(res, 500, {
        meta: {
          status: 500,
          message: "Something went wrong.",
        },
        errors: [
          {
            code: "INTERNAL_ERROR",
            message: "Something went wrong.",
          },
        ],
      });
    }
  }

  return sendResponse(res, 200, { message: 'Updated ticket successfully' });
};

export default handler;
