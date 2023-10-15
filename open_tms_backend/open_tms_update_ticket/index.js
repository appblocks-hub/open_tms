import { shared } from '@appblocks/node-sdk'
  const updateTicket = async (ticketId, data) => {
  // Import Prisma models using shared
  const Ticket = await shared.import('open_tms', 'Ticket');
  const TicketRevision = await shared.import('open_tms', 'TicketRevision');
  const TicketActivity = await shared.import('open_tms', 'TicketActivity');
  const { prisma } = await shared.getShared();

  // Find the latest ticket revision for the given ticketId
  const latestRevision = await TicketRevision.findOne({
    where: { ticketId },
    order: [['id', 'DESC']],
  });

  // Validate the process path to ensure the transition is valid
  if (await validateProcessPath(latestRevision.currentStage, data.to_stage, data.assignee_id)) {
    // Update the ticket fields
    const ticket = await Ticket.findByPk(ticketId);
    if (data.name) ticket.name = data.name;
    if (data.description) ticket.description = data.description;

    // Save the updated ticket
    await ticket.save();

    // Create a new ticket revision
    const newRevision = await TicketRevision.create({
      ticketId,
      name: data.name || latestRevision.name,
      description: data.description || latestRevision.description,
    });

    // Get the stage_id for the 'to_stage' from the process path
    const stageId = await getStageIdFromProcessPath(data.to_stage);

    // Create a new entry in the ticket_activity table with the correct stage_id
    const activity = await TicketActivity.create({
      TicketRevisionId: newRevision.id,
      currentStage: stageId,
    });

    return { success: true, activity };
  } else {
    // If validation fails, throw an error
    throw new Error('Next stage or assignee is invalid.');
  }
};

// Get the stage_id from the process path for a given stage name
const getStageIdFromProcessPath = async (stageName) => {
  const ProcessPath = await shared.import('open_tms', 'ProcessPath');
  const Stage = await shared.import('open_tms', 'Stage');

  const processPath = await ProcessPath.findOne({
    where: { from_stage: latestRevision.currentStage },
    include: { nextStages: true },
  });

  if (!processPath) {
    throw new Error(`Invalid current stage: ${latestRevision.currentStage}`);
  }

  const nextStageObj = processPath.nextStages.find((stage) => stage.name === stageName);

  if (!nextStageObj) {
    throw new Error(`Invalid next stage: ${stageName}`);
  }

  return nextStageObj.stage_id;
};

const handler = async (event) => {
  const { req, res } = event;
  const { sendResponse } = await shared.getShared();

  // Health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' });
  }

  try {
    const { ticket_id, ...updateData } = req.body;
    const { success, activity } = await updateTicket(ticket_id, updateData);

    if (success) {
      return sendResponse(res, 200, { meta: { status: 200, message: 'Ticket updated successfully' }, activity });
    }
  } catch (error) {
    if (error.message === 'Next stage or assignee is invalid.') {
      return sendResponse(res, 400, {
        meta: { status: 400, message: 'Bad Request' },
        errors: [{ code: 'BAD_REQUEST', message: 'Next stage or assignee is invalid.' }],
      });
    } else {
      return sendResponse(res, 500, {
        meta: { status: 500, message: 'Something went wrong.' },
        errors: [{ code: 'INTERNAL_ERROR', message: 'Something went wrong.' }],
      });
    }
  }

  return sendResponse(res, 200, { message: 'Successfully updated ticket' });
};

export default handler;
