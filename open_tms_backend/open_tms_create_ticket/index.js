import { shared } from '@appblocks/node-sdk'

const allRequiredSet = (scope, ...properties) =>
  scope && (!properties || properties.every(key => !key || key in scope))

async function getStageIdByName(stageName) {
  const { prisma } = await shared.getShared()

  // Retrieves the unique identifier (ID) associated with a specific stage name from a database table
  const stage = await prisma.stage.findUnique({
    where: { name: stageName },
  });
  return stage.id;
}

async function getOrganizationId(userID) {
  const { prisma } = await shared.getShared()

  const queryResult = await prisma.$queryRaw`
        SELECT om.organisation_id
        FROM org_member_roles AS omr
        JOIN org_member AS om ON omr.user_id = om.created_by
        WHERE omr.user_id = ${userID};
      `;

  if (queryResult[0]) {
    const organisation_id = queryResult[0].organisation_id;
    return organisation_id;
  } else {
    console.error('User not found in org_member_roles.');
    return null
  }
}

// const handler = async (event) => {
const handler = async (req) => {
  const { sendResponse, prisma } = await shared.getShared()

  // const { req, res } = event

  try {

    // Perform Health check
    // if (req.params.health === 'health') {
    //   console.log('Health check success')
    //   // sendResponse(res, 400, { message: 'Health check success' })
    // }

    // User context from authentication middleware
    const creator_id = req?.user?.id
    if (!creator_id) {
      console.log("Unauthorized!")
      // return sendResponse(res, 401, { message: "Unauthorized!" })
    }
    const organisation_id = getOrganizationId(creator_id)


    if (req?.body && allRequiredSet(req?.body, "name", "department", "description", "ticket_type")) {

      return await prisma.$transaction(async (tx) => {

        // Create an entry in the tickets table
        const ticket = await prisma.ticket.create({
          data: {
            created_by: creator_id,
            organisation_id
          },
        });

        // Add descrption metadata for ticket
        // await prisma.org_member.create({
        //   data: {
        //     name: req.body.name,
        //     type: parseInt(req.body.ticket_type),
        //     created_by: creator_id,
        //     organisation_id: organisation_id,
        //   }
        // })

        // // Create a ticket revision for the ticket
        // await prisma.ticket_revision.create({
        //   data: {
        //     department: req.body.department,
        //     ticket_id: ticket.id,
        //     description: req.body.description,
        //     created_by: creator_id,
        //     title: req.body.name,
        //   },
        // });

        // // Create a log entry in the ticket_activity table
        // const stageName = 'ticket_raised'; // Name of the stage
        // const currentStageId = await getStageIdByName(stageName);
        // await prisma.ticket_activity.create({
        //   data: {
        //     ticket_revision_id: ticket.id,
        //     remark: req.body.description,
        //     created_by: creator_id,
        //     current_stage: currentStageId,
        //   },
        // });

        const response = {
          id: ticket.id,
        }
        // return sendResponse(res, 201, response, { message: 'Ticket created successfully' })
        return console.log('Ticket created successfully')
      })

    }
    // return sendResponse(res, 400, { message: 'Bad Request, one or more required values missing ' })
    console.log('Bad Request, one or more required values missing ')


  } catch (err) {
    console.error("Error encountered!: ", err);
    // return sendResponse(res, err.errorCode, {
    //   message: " Whoops!, an error occurred while processing the request",
    // });
    console.log("Whoops!, an error occurred while processing the request")
  }
}


const req = {
  body: {
    "name": "Scree",
    "department": "Fontend",
    "description": "Testing 1, 2",
    "ticket_type": "0"
  }
}
async function main() {
  // This transfer is successful
  await handler(req)
  // This transfer fails because Alice doesn't have enough funds in her account
  await handler(req)
}

main()


export default handler