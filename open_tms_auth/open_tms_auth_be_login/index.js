import { compare } from 'bcrypt'
import { shared, env } from '@appblocks/node-sdk'
import jwt from 'jsonwebtoken'

// env.init()
const handler = async ({ req, res }) => {
  const {
    sendResponse,
    isEmpty,
    prisma,
    validateRequestMethod,
    checkHealth,
  } = await shared.getShared()

  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: 'Please provide email ID and password to login',
      })
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        email: requestBody.email,
      },
    })

    if (!user) {
      return sendResponse(res, 400, {
        message: 'Invalid email/password',
      })
    }

    const isPasswordMatching = await compare(
      requestBody.password,
      user.password
    ).catch(() => false)

    if (!isPasswordMatching) {
      console.log(isPasswordMatching)
      return sendResponse(res, 401, {
        message: 'Invalid email/password',
      })
    }

    if (isPasswordMatching && !user?.is_verified) {
      return sendResponse(res, 403, {
        data: {
          user_id: user.id,
          isVerified: user.is_verified,
        },
        message: 'User is not Verified.',
      })
    }

    const tokenGenerate = {
      full_name: user.full_name,
      user_name: user.user_name,
      id: user.id,
      email: user.email,
      isVerified: user.is_verified,
      role: user.role,
    }

    const secretKey = process.env.BB_OPEN_TMS_AUTH_SECRET_KEY
    const refreshKey = process.env.BB_OPEN_TMS_AUTH_REFRESH_KEY

    const userResponse = {
      token: jwt.sign(tokenGenerate, secretKey, {
        expiresIn: process.env.BB_OPEN_TMS_AUTH_ACCESS_TOKEN_EXPIRY,
      }),
      refreshToken: jwt.sign(tokenGenerate, refreshKey, {
        expiresIn: process.env.BB_OPEN_TMS_AUTH_REFRESH_TOKEN_EXPIRY,
      }),
      refreshExpiry: parseInt(
        process.env.BB_OPEN_TMS_AUTH_REFRESH_TOKEN_EXPIRY.slice(0, -1),
        10
      ),
    }

    sendResponse(res, 200, {
      data: userResponse,
      message: 'Sucess',
    })
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
