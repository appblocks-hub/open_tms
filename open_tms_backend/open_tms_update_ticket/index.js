import { shared } from '@appblocks/node-sdk'

const PERMITTED_ROLE_TO_UPDATE_ASSIGNEE = 'role-assignee'
const REJECTED_TICKET_STATUS = 'ticket_rejected'

async function findEntityByProp(prisma, entityId, entityName, entityPropertyName, res) {
  const entity = await prisma[entityName].findFirst({
    where: {
      [entityPropertyName]: entityId,
    },
  })
  if (!entity) {
    console.log(`No ${entityName} with the given ${entityPropertyName} found.`)
    res.errorResponse(400, `No ${entityName} with the given ${entityPropertyName} found.`)
  }
  return entity
}

async function findLatestEntity(prisma, entityId, entityName, entityPropertyName, res) {
  const entity = await prisma[entityName].findFirst({
    where: {
      [entityPropertyName]: entityId,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  if (!entity) {
    console.log(`No ${entityName} with the given ${entityPropertyName} found.`)
    res.errorResponse(400, `No ${entityName} with the given ${entityPropertyName} found.`)
  }
  return entity
}

const handler = async (event) => {
  //! THIS HANDLER IS NOT TESTED. JUST TRIED TO WRITE THE FLOW
  const { req, res } = event
  const { validateRequestMethod, validateRequestBody, prisma } = await shared.getShared()
  const requiredFields = ['ticket_id', 'to_stage', 'assignee_id']
  const requiredFieldsForRevision = ['name', 'description']

  try {
    if (req.params.health === 'health') return res.successResponse(null, 'Health check succeeded', 200)
    await validateRequestMethod(req, ['POST'])

    const requestBody = req?.body

    const userID = req?.user?.id
    if (!userID) {
      return res.errorResponse(401)
    }

    const validationError = validateRequestBody(requiredFields, req.body)
    if (validationError) return res.errorResponse(400, validationError)

    await findEntityByProp(prisma, requestBody.ticket_id, 'ticket', 'id', res)
    await findEntityByProp(prisma, requestBody.assignee_id, 'org_member_roles', 'user_id', res)
    const orgCurrentUser = await findEntityByProp(prisma, userID, 'org_member_roles', 'user_id', res)
    const currentUserRole = await findEntityByProp(prisma, orgCurrentUser.role_id, 'roles', 'id', res)

    if (currentUserRole.name !== PERMITTED_ROLE_TO_UPDATE_ASSIGNEE) {
      return res.errorResponse(401, `Permission denied for this user role ${currentUserRole.name}`)
    }

    const stage = await findEntityByProp(prisma, requestBody.to_stage, 'stage', 'id', res)
    const latestTicketRevision = await findLatestEntity(
      prisma,
      requestBody.ticket_id,
      'ticket_revision',
      'ticket_id',
      res
    )
    const latestTicketActivity = await findLatestEntity(
      prisma,
      latestTicketRevision.id,
      'ticket_activity',
      'ticket_revision_id',
      res
    )

    const organisation = await findEntityByProp(prisma, userID, 'org_member', 'created_by', res)

    const process = await prisma.process.findFirst({
      select: { id: true },
      where: {
        organisation_id: organisation?.organisation_id,
      },
    })
    if (!process) res.errorResponse(400, 'Process not found for this ticket')

    const processPath = await prisma.process_path.findFirst({
      where: {
        process_id: process?.id,
        to_stage: requestBody?.to_stage,
        from_stage: latestTicketActivity.current_stage,
      },
    })
    if (!processPath) res.errorResponse(400, 'Process path not found for this ticket')

    let newEntityActivity
    let newEntityRevision

    if (stage.name !== REJECTED_TICKET_STATUS) {
      newEntityActivity = await prisma.ticket_activity.create({
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
      const validationForRevisionError = validateRequestBody(requiredFieldsForRevision, req.body)
      if (validationForRevisionError) return res.errorResponse(400, validationForRevisionError)

      newEntityRevision = await prisma.ticket_revision.create({
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

      newEntityActivity = await prisma.ticket_activity.create({
        data: {
          created_by: req?.user?.id,
          updated_by: req?.user?.id,
          assignee_id: requestBody?.assignee_id,
          current_stage: requestBody?.to_stage,
          ticket_revision_id: newEntityRevision?.id,
          ...(requestBody?.remarks && { remark: requestBody?.remarks }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
    }

    return res.successResponse(
      {
        ticket_id: requestBody.ticket_id,
        revision_id: newEntityRevision ? newEntityRevision?.id : latestTicketRevision?.id,
        activity_id: newEntityActivity?.id,
      },
      'Ticket updated successfully'
    )
  } catch (error) {
    return res.errorResponse(500, error)
  }
}

export default handler
