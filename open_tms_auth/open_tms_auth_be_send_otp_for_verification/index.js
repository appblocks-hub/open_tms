/* eslint-disable import/extensions */
import { shared, env } from "@appblocks/node-sdk";
import hbs from "hbs";
import otpTemp from "./templates/otp-email-temp.js";

env.init();
const handler = async (event) => {
  const { req, res } = event;

  const {
    sendResponse,
    prisma,
    validateRequestMethod,
    checkHealth,
    isEmpty,
    redis,
    sendMail,
    generateRandomString,
  } = await shared.getShared();
  try {
    // health check
    if (checkHealth(req, res)) return;

    await validateRequestMethod(req, ["POST"]);

    const requestBody = req.body;

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty("email")) {
      return sendResponse(res, 400, {
        message: "Please provide a Email",
      });
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        email: requestBody.email,
      },
    });

    if (!user) {
      return sendResponse(res, 400, {
        message: "Invalid User ID",
      });
    }

    const otp = generateRandomString();

    // Store the otp with an expiry stored in env.function in seconds
    if (!redis.isOpen) await redis.connect();
    await redis.set(`${user.id}_otp`, otp, { EX: 600 });
    await redis.disconnect();

    const emailTemplate = hbs.compile(otpTemp);

    const message = {
      to: user.email,
      from: {
        name: process.env.BB_OPEN_TMS_MAILER_NAME,
        email: process.env.BB_OPEN_TMS_MAILER_EMAIL,
      },
      subject: "Verify OTP",
      text: "Please verify your otp",
      html: emailTemplate({
        logo: process.env.BB_OPEN_TMS_LOGO_URL,
        user: user.full_name,
        otp,
      }),
    };
    await sendMail(message);

    return sendResponse(res, 200, {
      data: { user_id: user.id, email: user.email, name: user.full_name },
      message:
        "We have sent you an email containing One time password to registered email",
    });
  } catch (e) {
    console.log(e.message);
    if (e.errorCode && e.errorCode < 500) {
      return sendResponse(res, e.errorCode, {
        message: e.message,
      });
    } else {
      return sendResponse(res, 500, {
        message: "failed",
      });
    }
  }
};

export default handler;
