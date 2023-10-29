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
 *               org_member_id:
 *                 type: string
 *                 description: Organization member id which need to be associated with this department
 *                 example: 2e6b588f-2cb8-4bb6-a0c8-414651ab9b62
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
    const org_member_id = req.body.org_member_id;

    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    if (isEmpty(req.body.name) || isEmpty(req.body.display_name) || isEmpty(req.body.org_member_id)) {
      return sendResponse(res, 400, {
        message: "Please provide valid input",
      });
    }

    const [existingDepartment, existingDepartmentOfOrgMember] = await Promise.all([
      prisma.department.findFirst({
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
      }), prisma.department.findFirst({
        where: {
          id: org_member_id
        }
      })
    ]);

    if (existingDepartment) {
      return sendResponse(res, 400, {
        message: "Department with similar name already exists.",
      });
    }
    if (existingDepartmentOfOrgMember) {
      return sendResponse(res, 400, {
        message: "Organization member is already associated with another department.",
      });
    }

    const departmentData = {
      name,
      display_name,
      id: org_member_id
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