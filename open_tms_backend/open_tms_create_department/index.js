import { shared } from '@appblocks/node-sdk';

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
 * /open_tms_backend/open_tms_create_department:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create department block
 *     description: This function will create new department.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Department type name
 *                 example: Operations
 *               display_name:
 *                 type: string
 *                 description: Department type display name
 *                 example: People Operations
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
  try {
    const { req, res } = event
    const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth } = await shared.getShared();
    const name = req.body.name;
    const display_name = req.body.display_name;
    const logged_in_user_id = req.user.id;

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    const loggedInUser = await prisma.$queryRaw`
    SELECT org_member.organisation_id
    FROM public.org_member
    INNER JOIN public.org_member_roles ON org_member.id = org_member_roles.id
    INNER JOIN public.roles ON org_member_roles.role_id = roles.id
    WHERE org_member_roles.user_id = ${logged_in_user_id}
    AND roles.name = 'role-assignee'`;

    if (!loggedInUser.length > 0) {
      return sendResponse(res, 401, {
        message: "Unauthorized access",
      });
    }

    if (isEmpty(req.body.name) || isEmpty(req.body.display_name)) {
      return sendResponse(res, 400, {
        message: "Please provide valid input",
      });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        OR: [
          {
            name: {
              contains: name.replace(/\s/g, ''),
              mode: 'insensitive',
            },
          },
          {
            display_name: {
              contains: display_name.replace(/\s/g, ''),
              mode: 'insensitive',
            },
          },
        ],
      }
    })

    if (existingDepartment) {
      return sendResponse(res, 400, {
        message: "Department with similar name already exists.",
      });
    }

    const orgMemberData = {
      created_by: logged_in_user_id,
      organisation_id: loggedInUser[0].organisation_id,
      type: 2
    }

    const orgMember = await prisma.org_member.create({
      data: orgMemberData,
    });

    const departmentData = {
      name,
      display_name,
      id: orgMember.id
    }

    await prisma.department.create({
      data: departmentData,
    });

    return sendResponse(res, 200, { message: 'Successfully created department' })
  } catch (err) {
    return sendResponse(res, 500, {
      message: "Something went wrong.",
    });
  }
}

export default handler