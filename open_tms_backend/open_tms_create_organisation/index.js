import { shared } from '@appblocks/node-sdk'
import { v4 as uuidv4 } from 'uuid'

/**
 * @swagger
 * /open_tms_backend/open_tms_create_organisation:
 *   post:
 *     summary: Create an Organisation
 *     description: Create an Organisation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organisation's Name
 *                 example: Neoito
 *               display_name:
 *                 type: string
 *                 description:  Organisation's Display Name
 *                 example: Neoito
 *     responses:
 *        '201':
 *          description: Created
 *        '200':
 *          description: Ok
 *
 */

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, validateRequestMethod, isEmpty, checkHealth, validateRequiredParams, prisma } =
    await shared.getShared()
  const requiredParams = ['name', 'display_name']

  try {
    // health check
    if (checkHealth(req, res)) return {}

    await validateRequestMethod(req, ['POST'])
    const requestBody = req?.body

    // check if the request body is empty
    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: 'Please provide all required fields',
      })
    }

    // check if all the required fields are present in the body
    const paramMissing = validateRequiredParams(requestBody, requiredParams)

    // sending an error message if any of the field is missing
    if (paramMissing) {
      return sendResponse(res, 400, {
        message: `Please provide ${paramMissing}`,
      })
    }

    const existingOrganisation = await prisma.organisation.findFirst({
      where: {
        OR: [
          {
            name: requestBody?.name,
          },
          {
            display_name: requestBody?.display_name,
          },
        ],
      },
    })

    if (existingOrganisation) {
      // The Orgnisation with the same name or display_name already exists in the database.
      return sendResponse(res, 400, {
        message: 'Orgnisation with the same name or display_name already exists.',
      })
    }

    const uniqueId = uuidv4()

    const tenant = await prisma.tenant.findFirst({
      where: {
        name: 'Appblocks',
      },
      select: {
        id: true,
      },
    })

    const newDataAdded = await prisma.organisation.create({
      data: {
        tenant_id: tenant?.id,
        created_by: req?.user?.id,
        id: uniqueId,
        updated_at: new Date(),
        created_at: new Date(),
        ...requestBody,
      },
    })

    if (!newDataAdded) {
      console.log('something went wrong while creating organisation....')
      return sendResponse(res, 400, {
        message: 'Something went wrong while creating organisation',
      })
    }

    return sendResponse(res, 200, {
      data: newDataAdded,
      message: 'Successfully created organisation',
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
