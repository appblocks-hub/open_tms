import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event
  try {
    // health check
    if (req.params.health === 'health') {
      res.write(JSON.stringify({ success: true, msg: 'Health check success' }))
      res.end()
      return
    }

    const { sendResponse, prisma } = await shared.getShared()

    console.log('send response is', sendResponse)
    console.log('prisma is ', prisma.ticket)

    const tickets = await prisma.ticket.findMany({
      where: {
        ticket_revision_ticket_id_fk: {
          ticket_activity: {
            some: {
              assignee_id: '2e6b588f-2cb8-4bb6-a0c8-414651ab9b62',
            },
          },
        },
      },
      select: {
        id: true, // Select the id from the tickets model
        ticket_revision_ticket_id_fk: {
          select: {
            id: true,
            process_id: true,
            title: true,
            description: true,
            created_at: true,
            ticket_activity: {
              where: {
                assignee_id: '2e6b588f-2cb8-4bb6-a0c8-414651ab9b62',
              },
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
  
  
    console.log("tickets are",JSON.stringify(tickets))

    res.json(tickets)

    // Add your code here
    res.write(JSON.stringify({ success: true, msg: `Happy Hacking` }))
    res.end()
  } catch (err) {
    console.log('error is \n', err)
  }

}

export default handler
