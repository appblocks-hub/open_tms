import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * /open_tms_backend/open_tms_delete_department:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a Department
 *     description: Deletes a department and its related records.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: Department ID to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Department deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 200
 *                 message: Department deleted successfully
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 400
 *                 message: Bad Request
 *               errors:
 *                 - code: BAD_REQUEST
 *                   message: Please provide a valid department id
 *       401:
 *         description: User have no role to perform the operation.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 400
 *                 message: Unauthorized
 *               errors:
 *                 - code: UNAUTHORIZED
 *                   message: Sorry, you do not have the necessary permissions to perform this operation
 *       404:
 *         description: Bad Request. Record to delete does not exist.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 404
 *                 message: Bad Request
 *               errors:
 *                 - code: RESOURCE_NOT_FOUND
 *                   message: Record to delete does not exist.
 *       500:
 *         description: Internal Server Error. Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 status: 500
 *                 message: Something went wrong
 *               errors:
 *                 - code: INTERNAL_ERROR
 *                   message: Something went wrong
 */
const handler = async (event) => {
  const { req, res } = event
  const { sendResponse, prisma, validateRequestMethod, HTTP_STATUS_CODES } = await shared.getShared()

  const ROLE_ASSIGNEE = 'role-assignee'
  // health check
  if (req.params.health === 'health') {
    return sendResponse(res, 200, { message: 'Health check success' })
  }

  await validateRequestMethod(req, ['DELETE'])

  // check if req contains id param

  // if empty throw error
  if (!req.query?.id) {
    return sendResponse(res, 400, {
      meta: {
        status: 400,
        message: HTTP_STATUS_CODES[400],
      },
      errors: [
        {
          code: 'MISSING_ID',
          message: `department id to delete is missing in request`,
        },
      ],
    })
  }

  const { id } = req.query

  try {
    // check if the user have required roles
    const userRole = await prisma.org_member_roles.findFirst({
      where: {
        user_id: req.user?.id,
      },
      include: {
        org_member_roles_role_fk: {
          select: {
            name: true,
          },
        },
      },
    })

    if (userRole.org_member_roles_role_fk?.name !== ROLE_ASSIGNEE) {
      return sendResponse(res, 401, {
        meta: {
          status: 401,
          message: HTTP_STATUS_CODES[401],
        },
        errors: [
          {
            code: 'UNAUTHORIZED',
            message: 'Sorry, you do not have the necessary permissions to perform this operation',
          },
        ],
      })
    }

    // start the transaction
    await prisma.$transaction(async (transactionPrisma) => {
      // delete department users
      await transactionPrisma.department_users.deleteMany({
        where: {
          department_id: id,
        },
      })

      // find org_member records associated with the department
      const orgMembers = await transactionPrisma.org_member.findMany({
        where: {
          org_member_department_users_fk: {
            some: {
              department_id: id,
            },
          },
        },
      })

      const orgMemberIds = orgMembers.map((orgMember) => orgMember.id)

      // delete org_member_roles related to the org_members
      await transactionPrisma.org_member_roles.deleteMany({
        where: {
          user_id: {
            in: orgMemberIds,
          },
        },
      })

      // delete org_members associated with the department
      await transactionPrisma.org_member.deleteMany({
        where: {
          id: {
            in: orgMemberIds,
          },
        },
      })

      // delete department
      await transactionPrisma.department.delete({
        where: {
          id,
        },
      })
    })

    return sendResponse(res, 200, {
      meta: {
        status: 200,
        message: 'Department deleted succesfully',
      },
    })
  } catch (error) {
    console.log(error)
    /**
     * refer prisma error codes
     * https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
     */
    if (error.code === 'P2025') {
      return sendResponse(res, 404, {
        meta: {
          status: 404,
          message: HTTP_STATUS_CODES[404],
        },
        errors: [
          {
            code: 'RESOURCE_NOT_FOUND',
            message: 'No department found with provided id',
          },
        ],
      })
    }
    return sendResponse(res, 500, {
      meta: {
        status: 500,
        message: HTTP_STATUS_CODES[500],
      },
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong.',
        },
      ],
    })
  }
}

export default handler
