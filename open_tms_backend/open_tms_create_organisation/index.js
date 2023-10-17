import { shared } from '@appblocks/node-sdk'
import { v4 as uuidv4 } from 'uuid'

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, validateRequestMethod, isEmpty, checkHealth, validateRequiredParams, prisma } =
    await shared.getShared()
  const requiredParams = ['name', 'display_name']

  const tenant_id = '71df8bec-075a-48a0-9ea7-6d5f85de729c'

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

    const uniqueId = uuidv4()

    const newDataAdded = await prisma.organisation.create({
      data: {
        tenant_id,
        created_by: req?.user?.id,
        id: uniqueId,
        updated_at: new Date(),
        created_at: new Date(),
        ...requestBody,
      },
    })

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
