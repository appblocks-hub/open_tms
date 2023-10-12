import { shared } from "@appblocks/node-sdk";

const handler = async (event) => {
  const { req, res } = event;

  const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth } =
    await shared.getShared();

  try {
    // health check
    if (checkHealth(req, res)) return;
    await validateRequestMethod(req, ["POST"]);

    const requestBody = req.body;
    const { email } = requestBody;

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty("email")) {
      return sendResponse(res, 400, {
        message:
          "Please provide the email address associated with your account.",
      });
    }

    const user_account = await prisma.user_account.findFirst({
      where: {
        email: email,
      },
      include: { user:  true },
    });

    if (!user_account) {
      return sendResponse(res, 400, {
        message: "No account found with the provided email.",
      });
    }

    const { user } = user_account;

    return sendResponse(res, 200, {
      data: { user_id: user.id },
      message: "User data fetched",
    });
  } catch (e) {
    console.log(e.message);
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : "something went wrong",
    });
  }
};

export default handler;
