import { shared } from '@appblocks/node-sdk'
import { compare } from 'bcrypt'
import { hash, genSalt } from 'bcrypt'

/**
 * @swagger
 * /open_tms_auth/open_tms_auth_be_reset_password:
 *   put:
 *     summary: Reset password for an existing user
 *     description: Reset password for an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_auth_token:
 *                 type: string
 *                 description: The user's auth token received from verify otp api
 *                 example: 5APZC8fAryDf8PnOtgvWcdS429Jel60d
 *               new_password:
 *                 type: string
 *                 description: The user's  new password
 *                 example: TestPassword@97
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 */
const handler = async (event) => {
  const { req, res } = event

  const {
    sendResponse,
    isEmpty,
    prisma,
    redis,
    validateRequestMethod,
    checkHealth,
  } = await shared.getShared()

  try {
    // health check
    if (checkHealth(req, res)) return
    await validateRequestMethod(req, ['PUT'])

    const requestBody = req.body

    if (
      isEmpty(requestBody) ||
      !requestBody.hasOwnProperty('user_auth_token') ||
      !requestBody.hasOwnProperty('new_password')
    ) {
      return sendResponse(res, 400, {
        message: 'Please enter AuthToken and new password.',
      })
    }

    const { user_auth_token, new_password } = requestBody

    if (!redis.isOpen) await redis.connect()
    const user_account_id = await redis.get(user_auth_token)
    await redis.disconnect()

    if (!user_account_id) {
      return sendResponse(res, 400, {
        message: 'Provided auth token does not exist.',
      })
    }

    function isPasswordValid(password) {
      // Password should be at least 8 characters long
      // It should contain at least one uppercase letter
      // It should contain at least one lowercase letter
      // It should contain at least one digit
      // It should contain at least one special character
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\d!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
      return passwordPattern.test(password)
    }

    if (!isPasswordValid(new_password)) {
      return sendResponse(res, 400, {
        message: 'Please provide a valid password.',
      })
    }

    const user_account = await prisma.user_account.findFirst({
      where: {
        id: user_account_id,
      },
    })

    if (!user_account) {
      return sendResponse(res, 400, {
        message: 'User account does not exist for the provided auth token.',
      })
    }

    const { user } = user_account

    if (!isPasswordValid(new_password)) {
      return sendResponse(res, 400, {
        message: 'Please provide a valid password',
      })
    }

    if (await compare(new_password, user_account.password_hash)) {
      return sendResponse(res, 400, {
        message: 'New password cannot be the same as the previous password.',
      })
    }

    const password_salt = await genSalt(10)
    const password_hash = await hash(new_password, password_salt)
    const updatedUserAccount = await prisma.user_account.update({
      where: {
        id: user_account.id,
      },
      data: {
        password_salt,
        password_hash,
        is_email_verified: true,
        updated_at: new Date(),
      },
    })

    if (!updatedUserAccount) {
      return sendResponse(res, 400, {
        message: 'Failed to update new password',
      })
    }

    return sendResponse(res, 200, {
      message: 'Password updated',
    })
  } catch (e) {
    console.log(e.message)
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : 'something went wrong',
    })
  }
}

export default handler
