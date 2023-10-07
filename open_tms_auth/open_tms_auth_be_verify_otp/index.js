import { shared, env } from '@appblocks/node-sdk'

env.init()
const handler = async (event) => {
  const { req, res } = event

  const {
    sendResponse,
    prisma,
    validateRequestMethod,
    checkHealth,
    isEmpty,
    redis,
    generateRandomString,
  } = await shared.getShared()
  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (
      isEmpty(requestBody) ||
      !requestBody.hasOwnProperty('email') ||
      !requestBody.hasOwnProperty('otp') ||
      requestBody?.otp?.length !== 6
    ) {
      return sendResponse(res, 400, {
        message: 'Please provide a valid Email and OTP',
      })
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        email: requestBody.email,
      },
    })

    if (!user) {
      return sendResponse(res, 400, {
        message: 'Please enter a valid user id',
      })
    } else {
      // Retrieve the value of the key
      if (!redis.isOpen) await redis.connect()
      const otp = await redis.get(`${user.id}_otp`)
      await redis.disconnect()

      if (otp == requestBody.otp) {
        return sendResponse(res, 400, {
          message: 'Invalid OTP. Please try again or generate new otp',
        })
      }

      if (otp == requestBody.otp) {
        const updatedUser = await prisma.admin_users.update({
          where: {
            id: user.id,
          },
          data: {
            is_verified: true,
            updated_at: new Date(),
          },
        })

        const userAuthToken = generateRandomString(32)
        // Store the otp with an expiry stored in env.function in seconds
        if (!redis.isOpen) await redis.connect()
        await redis.set(userAuthToken, user.id, {
          EX: Number(process.env.BB_OPEN_TMS_AUTH_OTP_EXPIRY_TIME_IN_SECONDS),
        })
        await redis.disconnect()

        sendResponse(res, 200, {
          data: { user_auth_token: userAuthToken },
          message: 'OTP verified successfully',
        })
      } else {
        return sendResponse(res, 400, {
          message: 'Invalid OTP. Please try again or generate new otp',
        })
      }
    }
  } catch (e) {
    console.log(e.message)
    if (e.errorCode && e.errorCode < 500) {
      return sendResponse(res, e.errorCode, {
        message: e.message,
      })
    } else {
      return sendResponse(res, 500, {
        message: 'failed',
      })
    }
  }
}

export default handler
