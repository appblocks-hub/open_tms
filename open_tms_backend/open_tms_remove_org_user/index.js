import { shared } from '@appblocks/node-sdk'

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /open_tms_backend/open_tms_remove_org_user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove user under an organization
 *     description: Remove User From Organization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               org_member_id:
 *                 type: string
 *                 description: The member id
 *                 example: dsbcndjA28
 *     responses:
 *       '201':
 *         description: Deleted
 *       '200':
 *         description: Ok
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */

const handler = async (event) => {
  const { req, res } = event

  try {
    const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth } = await shared.getShared();
    const org_member_id = req.body.org_member_id;
    const logged_in_user_id = req.user.id;

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    if (isEmpty(org_member_id)) {
      return sendResponse(res, 400, {
        message: "Please provide organization user id",
      });
    }

    const organizationMember = await prisma.org_member.findFirst({
      where: {
        id: org_member_id,
      },
    });

    if (!organizationMember) {
      return sendResponse(res, 400, {
        message: "Invalid user id",
      });
    }

    const loggedInUser = await prisma.$queryRaw`
    SELECT
      CASE
       WHEN EXISTS (
          SELECT 1
          FROM public.org_member
          INNER JOIN public.org_member_roles ON org_member.id = org_member_roles.id
          INNER JOIN public.roles ON org_member_roles.role_id = roles.id
          WHERE org_member.organisation_id = ${organizationMember.organisation_id}
          AND org_member_roles.user_id = ${logged_in_user_id}
          AND roles.name = 'role-assignee'
        ) THEN true
        ELSE false
      END AS isAdmin;`;

    const isAdmin = loggedInUser[0]?.isadmin || false;

    if (!isAdmin) {
      return sendResponse(res, 401, {
        message: "Unauthorized access",
      });
    }

    const departmentUserRecords = await prisma.department_users.findMany({
      where: {
        org_member_id
      }
    });

    const departmentUserIds = departmentUserRecords.map((record) => record.id);

    await Promise.all([prisma.department_users.deleteMany({
      where: {
        id: {
          in: departmentUserIds
        }
      }
    }), prisma.org_member_roles.delete({
      where: {
        id: org_member_id
      }
    }), prisma.org_member.delete({
      where: {
        id: org_member_id
      }
    })]);

    return sendResponse(res, 200, { message: 'Successfully deleted ticket type' });
  }
  catch (err) {
    return sendResponse(res, 500, {
      message: "Something went wrong.",
    });
  }
}

export default handler
