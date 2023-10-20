import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * /open_tms_backend/open_tms_create_department:
 *   post:
 *     summary: Create an Department
 *     description: Create an Department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Department's Name
 *                 example: AppBlocks
 *               display_name:
 *                 type: string
 *                 description:  Department's Display Name
 *                 example: AppBlocks
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
  const requiredParams = ['name', 'display_name', 'org_member_id']

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

    const existingDepartment = await prisma.department.findFirst({
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

    if (existingDepartment) {
      // The department with the same name or display_name already exists in the database.
      return sendResponse(res, 400, {
        message: 'Department with the same name or display_name already exists.',
      })
    }

    const newDataAdded = await prisma.department.create({
      data: {
        id: requestBody?.org_member_id,
        updated_at: new Date(),
        created_at: new Date(),
        name: requestBody?.name,
        display_name: requestBody?.display_name,
      },
    })

    return sendResponse(res, 200, {
      data: newDataAdded,
      message: 'Successfully created department',
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
