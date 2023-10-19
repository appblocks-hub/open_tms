import { compare } from "bcrypt";
import { shared } from "@appblocks/node-sdk";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /open_tms_auth/open_tms_auth_be_login:
 *   post:
 *     summary: Login for a new user
 *     description: Login for a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: memberUser4@mailinator.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Password@97
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 */
const handler = async ({ req, res }) => {
  const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth } =
    await shared.getShared();

  try {
    // health check
    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    const requestBody = req.body;

    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: "Please provide email ID and password to login",
      });
    }

    const user_account = await prisma.user_account.findFirst({
      where: {
        email: requestBody.email,
      },
      include: { user: true },
    });

    if (!user_account) {
      console.log("no user account....");
      return sendResponse(res, 400, {
        message: "Invalid email/password",
      });
    }

    const { user } = user_account;

    const isPasswordMatching = await compare(
      requestBody.password,
      user_account.password_hash
    ).catch(() => false);

    if (!isPasswordMatching) {
      console.log(isPasswordMatching, "password not matching.....");
      return sendResponse(res, 401, {
        message: "Invalid email/password",
      });
    }

    if (isPasswordMatching && !user_account.is_email_verified) {
      return sendResponse(res, 403, {
        data: {
          user_id: user.id,
          is_email_verified: user_account.is_email_verified,
        },
        message: "User is not Verified.",
      });
    }

    const tokenGenerate = {
      first_name: user.first_name,
      id: user.id,
      email: user_account.email,
      is_email_verified: user_account.is_email_verified,
    };

    const secretKey = process.env.BB_OPEN_TMS_SECRET_KEY;
    const refreshKey = process.env.BB_OPEN_TMS_REFRESH_KEY;
    console.log("secrete key ", secretKey);
    console.log("refreshKey key ", refreshKey);

    const userResponse = {
      token: jwt.sign(tokenGenerate, secretKey, {
        expiresIn: process.env.BB_OPEN_TMS_ACCESS_TOKEN_EXPIRY,
      }),
      refreshToken: jwt.sign(tokenGenerate, refreshKey, {
        expiresIn: process.env.BB_OPEN_TMS_REFRESH_TOKEN_EXPIRY,
      }),
      refreshExpiry: parseInt(
        process.env.BB_OPEN_TMS_REFRESH_TOKEN_EXPIRY.slice(0, -1),
        10
      ),
    };
    console.log("\nsecretKey : ", secretKey);
    console.log("\ntoken : ", userResponse.token);

    sendResponse(res, 200, { data: userResponse, message: "Success" });
  } catch (e) {
    console.log(e.message);
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : "something went wrong",
    });
  }
};

export default handler;
