import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * /open_tms_backend/open_tms_update_ticket:
 *   post:
 *     summary: Update ticket function block
 *     description: An endpoint open_tms_update_ticket in the backend under the directory backend/open_tms_update_ticket to handle ticket update in the Ticket Management System (TMS)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: string
 *                 description: Id of the ticket to update
 *                 example: 9fc38479-1619-48d1-8aa6-996cff08a5bb
 *               assignee_id:
 *                 type: string
 *                 description:  Department ID
 *                 example: 0cc0354e-152a-4dcf-ae91-25a761598bbe
 *               to_stage:
 *                 type: string
 *                 description:  Stage ID
 *                 example: 36b509da-5f49-4783-9373-f5e970467855
 *               name:
 *                 type: string
 *                 description: Name of ticket to be updated to
 *                 example: Sample Ticket Name
 *               description:
 *                 type: string
 *                 description: Description of ticket to be updated to
 *                 example: Sample Ticket Desc
 *               remarks:
 *                 type: string
 *                 description: Remarks
 *                 example: this is a sample remark
 *     responses:
 *        '201':
 *          description: Created
 *        '200':
 *          description: Ok
 *
 */

// A middleware function to validate the required parameters
function validateRequiredParams(req, requiredParams) {
  for (const param of requiredParams) {
    if (!req[param]) {
      return param
    }
  }
  return false
}

// A middleware function to check if ticket revision required
function ticketRevisionRequired(object, arrayOfStrings) {
  for (const key of arrayOfStrings) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      return true // Object has at least one of the keys from the array
    }
  }
  return false // Object does not have any of the keys
}

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, validateRequestMethod, isEmpty, checkHealth, prisma } = await shared.getShared()
  const requiredParams = ['ticket_id', 'to_stage', 'assignee_id']
  const paramsRequiredForRevsion = ['name', 'description']

  try {
    // health check
    if (checkHealth(req, res)) return {}

    await validateRequestMethod(req, ['POST'])
    const requestBody = req?.body

    // check if the request body is empty
    if (isEmpty(requestBody)) {
      console.log('Please provide all required fields')
      return sendResponse(res, 400, {
        message: 'Please provide all required fields',
      })
    }

    // check if all the required fields are present in the body
    const paramMissing = validateRequiredParams(requestBody, requiredParams)

    // sending an error message if any of the field is missing
    if (paramMissing) {
      console.log(`Please provide ${paramMissing}`)
      return sendResponse(res, 400, {
        message: `Please provide ${paramMissing}`,
      })
    }

    // check if all the required fields are present in the body
    const revisionRequired = ticketRevisionRequired(requestBody, paramsRequiredForRevsion)

    const ticketDetails = await prisma.ticket.findFirst({
      where: {
        id: requestBody?.ticket_id,
      },
    })

    // Checking if the ticket exists in the database.
    if (!ticketDetails) {
      console.log('No ticket with the given ticket id found.')
      return sendResponse(res, 400, {
        message: 'No ticket with the given ticket id found.',
      })
    }

    const departmentExists = await prisma.department.findFirst({
      where: {
        id: requestBody?.assignee_id,
      },
    })

    // Checking if the department exists in the database.
    if (!departmentExists) {
      console.log('No department with the given department id found.')
      return sendResponse(res, 400, {
        message: 'No department with the given department id found.',
      })
    }

    const stageIdExists = await prisma.stage.findFirst({
      where: {
        id: requestBody?.to_stage,
      },
    })

    // Checking if the stage exists in the database.
    if (!stageIdExists) {
      console.log('No stage with the given stage id found.')
      return sendResponse(res, 400, {
        message: 'No stage with the given stage id found.',
      })
    }

    const latestTicketRevision = await prisma.ticket_revision.findFirst({
      where: {
        ticket_id: requestBody?.ticket_id,
      },
      orderBy: {
        created_at: 'desc', // Order by created_at in descending order (latest first)
      },
    })

    // Checking if any ticket revision exists in the database.
    if (!latestTicketRevision) {
      console.log('No ticket revisions found for the specified ticket.')
      return sendResponse(res, 400, {
        message: 'No ticket revisions found for the specified ticket.',
      })
    }

    // Find the latest ticket activity for the latest ticket revision
    const latestTicketActivity = await prisma.ticket_activity.findFirst({
      where: {
        ticket_revision_id: latestTicketRevision.id,
      },
      orderBy: {
        created_at: 'desc', // Order by created_at in descending order (latest first)
      },
    })

    // Checking if any ticket activity exists in the database.
    if (!latestTicketActivity) {
      console.log('No ticket activity found for the specified ticket activity.')
      return sendResponse(res, 400, {
        message: 'No ticket activity found for the specified ticket activity.',
      })
    }

    // Find the current stage details for the ticket
    const currentStageDetails = await prisma.stage.findFirst({
      where: {
        id: latestTicketActivity.current_stage,
      },
    })

    // Checking if the current stage exists in the database.
    if (!currentStageDetails) {
      console.log('No stage found for the specified stage id.')
      return sendResponse(res, 400, {
        message: 'No stage found for the specified stage id.',
      })
    }

    const organisation = await prisma.org_member.findFirst({
      select: { organisation_id: true },
      where: {
        id: requestBody?.assignee_id,
      },
    })

    // Find the process id for the given organisation
    const process = await prisma.process.findFirst({
      select: { id: true },
      where: {
        organisation_id: organisation?.organisation_id,
      },
    })

    // Checking if the current stage exists in the database.
    if (!process) {
      console.log('No process found for the specified assignee id.')
      return sendResponse(res, 400, {
        message: 'No process found for the specified assignee id.',
      })
    }

    const processPath = await prisma.process_path.findFirst({
      where: {
        process_id: process?.id,
        to_stage: requestBody?.to_stage,
        from_stage: latestTicketActivity.current_stage,
      },
    })

    // // Checking if the process path exists
    if (!processPath) {
      console.log('No process path found.')
      return sendResponse(res, 400, {
        message: 'No process path found.',
      })
    }

    let newTicketActivity
    let newTicketRevision
    if (!revisionRequired) {
      newTicketActivity = await prisma.ticket_activity.create({
        data: {
          created_by: req?.user?.id,
          updated_by: req?.user?.id,
          assignee_id: requestBody?.assignee_id,
          current_stage: requestBody?.to_stage,
          ticket_revision_id: latestTicketRevision?.id,
          ...(requestBody?.remarks && { remark: requestBody?.remarks }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
    } else {
      newTicketRevision = await prisma.ticket_revision.create({
        data: {
          created_by: req?.user?.id,
          updated_by: req?.user?.id,
          process_id: process?.id,
          ticket_id: requestBody?.ticket_id,
          created_at: new Date(),
          updated_at: new Date(),
          title: requestBody?.name ? requestBody?.name : latestTicketRevision?.title || null,
          description: requestBody?.description ? requestBody?.description : latestTicketRevision?.description || null,
        },
      })
      newTicketActivity = await prisma.ticket_activity.create({
        data: {
          created_by: req?.user?.id,
          updated_by: req?.user?.id,
          assignee_id: requestBody?.assignee_id,
          current_stage: requestBody?.to_stage,
          ticket_revision_id: newTicketRevision?.id,
          ...(requestBody?.remarks && { remark: requestBody?.remarks }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
    }

    return sendResponse(res, 200, {
      data: {
        ticket_id: requestBody?.ticket_id,
        ticket_revision_id: newTicketRevision ? newTicketRevision?.id : latestTicketRevision?.id,
        ticket_activity_id: newTicketActivity?.id,
      },
      message: 'Ticket updated successfully',
    })
  } catch (e) {
    console.log(e.message)
    if (e.errorCode && e.errorCode < 500) {
      return sendResponse(res, e.errorCode, {
        message: e.message,
      })
    }
    return sendResponse(res, 500, {
      message: 'failed',
    })
  }
}

export default handler
