/* eslint-disable import/extensions */
import hbs from 'hbs'
import { genSalt, hash } from 'bcrypt'
import { shared } from '@appblocks/node-sdk'
import otpTemp from './templates/otp-temp.js'
import validateSignupInput from './validation.js'

/**
 * @swagger
 * /open_tms_auth/open_tms_auth_be_signup:
 *   post:
 *     summary: Signup a new user
 *     description: Signup a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The user's first name
 *                 example: test
 *               last_name:
 *                 type: string
 *                 description: The user's last name
 *                 example: user5
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: appblocksadmin@mailinator.com
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
  const { sendResponse, isEmpty, prisma, validateRequestMethod, checkHealth, generateRandomString, sendMail, redis } =
    await shared.getShared()

  try {
    // health check
    if (checkHealth(req, res)) return {}

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: 'Please provide the details',
      })
    }

    validateSignupInput(requestBody)

    const emailValid = await prisma.user_account.findFirst({
      where: { email: requestBody.email },
    })

    if (emailValid) {
      return sendResponse(res, 400, {
        message: 'This email is already in use',
      })
    }

    const password_salt = await genSalt(10)
    const password_hash = await hash(requestBody.password, password_salt)

    const user = {
      first_name: requestBody.first_name,
      last_name: requestBody.last_name,
      display_name: `${requestBody.first_name} ${requestBody.last_name}`,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const user_account = {
      email: requestBody.email,
      password_salt,
      password_hash,
      is_email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
      provider: 'password',
    }

    let user_account_id = null
    await prisma.$transaction(async (tx) => {
      const userData = await tx.user.create({
        data: user,
      })
      const userAccData = await tx.user_account.create({
        data: { ...user_account, user_id: userData.id },
      })
      user_account_id = userAccData.id
    })

    const otp = generateRandomString()
    if (!redis.isOpen) await redis.connect()
    await redis.set(`${user_account_id}_otp`, otp, {
      EX: Number(process.env.BB_OPEN_TMS_OTP_EXPIRY_TIME_IN_SECONDS),
    })
    await redis.disconnect()

    const emailTemplate = hbs.compile(otpTemp)

    const message = {
      to: requestBody.email,
      from: {
        name: process.env.EMAIL_SENDER_NAME,
        email: process.env.SENDER_EMAIL_ID,
      },
      subject: 'verify otp',
      text: 'Please verify your otp',
      html: emailTemplate({
        logo: process.env.BB_OPEN_TMS_LOGO_URL,
        user: user.first_name,
        otp,
      }),
    }
    await sendMail(message)

    return sendResponse(res, 200, {
      message: 'OTP send to registered email',
    })
  } catch (e) {
    console.log(e.message)
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : 'something went wrong',
    })
  }
}

export default handler
