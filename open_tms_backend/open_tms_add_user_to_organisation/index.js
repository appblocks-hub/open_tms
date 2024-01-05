import { shared } from '@appblocks/node-sdk'
import { v4 as uuidv4 } from 'uuid'

const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, validateRequestMethod, isEmpty, checkHealth, validateRequiredParams, prisma } =
    await shared.getShared()
  const requiredParams = ['user_id', 'organisation_id', 'role_id']

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

    // Checking if the role exists with the given role_id
    const roleData = await prisma.roles.findFirst({
      where: {
        id: requestBody.role_id,
      },
    })

    if (!roleData) {
      console.log('Invalid role ID')
      return sendResponse(res, 400, {
        message: 'Invalid role ID',
      })
    }

    const orgData = await prisma.organisation.findFirst({
      where: {
        id: requestBody.organisation_id,
      },
    })

    if (!orgData) {
      console.log('Invalid organisation ID')
      return sendResponse(res, 400, {
        message: 'Invalid organisation ID',
      })
    }


    // Checking if the user already present in the organisation with same role
    const userExistsInOrgMember = await prisma.org_member.findFirst({
      where: {
        type: 1, 
        org_member_roles_fk: {
          some: {
            user_id: requestBody.user_id, // Check for the user_id
            role_id: requestBody.role_id, // Check for the role_id
          },
        },
        organisation_id: requestBody.organisation_id, // Check for the organisation_id
      },
    })

    if (userExistsInOrgMember) {
      console.log('User Already present in the organisation')
      return sendResponse(res, 400, {
        message: 'User Already present in the organisation',
      })
    }
 
    await prisma.$transaction(async (tx) => {
      const uniqueOrgMemberId = uuidv4()
      
      const newOrgMember = await tx.org_member.create({
        data: {
          created_by: req?.user?.id,
          id: uniqueOrgMemberId,
          updated_at: new Date(),
          created_at: new Date(),
          type: 1,
          organisation_id: requestBody?.organisation_id,
        },
      })

      if (!newOrgMember) {
        console.log('something went wrong while adding user....')
        return sendResponse(res, 400, {
          message: 'Something went wrong while adding user',
        })
      }

      const newOrgMemberRole = await tx.org_member_roles.create({
        data: {
          user_id: requestBody?.user_id,
          role_id: requestBody?.role_id,
          id: uniqueOrgMemberId,
          updated_at: new Date(),
          created_at: new Date(),
        },
      })

      if (!newOrgMemberRole) {
        console.log('something went wrong while adding org member role....')
        return sendResponse(res, 400, {
          message: 'Something went wrong while adding organisation member role',
        })
      }
      return sendResponse(res, 200, {
        data: newOrgMember,
        message: 'User added successfully',
      })
    })
    return sendResponse(res, 500, {
      message: 'failed',
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
