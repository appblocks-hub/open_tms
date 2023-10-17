import { shared } from "@appblocks/node-sdk";

const handler = async ({ req, res }) => {
  try {
    const { prisma } = await shared.getShared();

    // Get data from the request body
    const {
      ticket_id,
      to_stage,
      assignee_id,
      remarks,
      name,
      description,
    } = req.body;

    // 1. Find the latest ticket revision
    const latestTicketRevision = await prisma.ticket_revision.findFirst({
      where: { ticket_id },
      orderBy: { created_at: "desc" },
    });

    if (!latestTicketRevision) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // 2. Find the latest ticket activity for the latest ticket revision
    const latestTicketActivity = await prisma.ticket_activity.findFirst({
      where: { ticket_revision_id: latestTicketRevision.id },
      orderBy: { created_at: "desc" },
    });

    if (!latestTicketActivity) {
      return res.status(404).json({ message: 'Ticket activity not found' });
    }

    // 3. Find the current stage from the latest ticket activity
    const currentStage = latestTicketActivity.current_stage;

    // 4. Validate the to stage and assignee with available process paths
    const processPath = await prisma.process_path.findFirst({
      where: { from_stage: currentStage, to_stage },
    });

    if (!processPath || processPath.process_id !== latestTicketRevision.process_id) {
      return res.status(400).json({
        meta: { status: 400, message: 'Bad Request' },
        errors: [
          { code: 'BAD_REQUEST', message: 'Next stage or assignee is invalid.' },
        ],
      });
    }

    // 5. If validation passes, add a new entry to the ticket_activity table
    const newTicketActivity = await prisma.ticket_activity.create({
      data: {
        created_by: req.user.id,
        assignee_id,
        current_stage: to_stage,
        ticket_revision_id: latestTicketRevision.id,
        remark: remarks,
      },
    });

    // 6. If the ticket needs to be revised, create a new entry in the ticket_revision table
 if (name || description) {
  const newTicketRevision = await prisma.ticket_revision.create({
    data: {
      title: name || latestTicketRevision.title, // Update the title attribute
      description: description || latestTicketRevision.description,
      created_by: req.user.id,
      process_id: latestTicketRevision.process_id,
      ticket_id,
    },
  });

  // Create a new ticket_activity entry for the revised ticket
  await prisma.ticket_activity.create({
    data: {
      created_by: req.user.id,
      current_stage: to_stage,
      ticket_revision_id: newTicketRevision.id,
      remark: remarks,
    },
  });
}

    return res.status(200).json({
      meta: { status: 200, message: 'Ticket updated successfully' },
      data: {
        ticket_id,
        ticket_revision_id: newTicketRevision?.id || latestTicketRevision.id,
        ticket_activity_id: newTicketActivity.id,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      meta: { status: 500, message: 'Something went wrong.' },
      errors: [{ code: 'INTERNAL_ERROR', message: 'Something went wrong.' }],
    });
  }
};

export default handler;
