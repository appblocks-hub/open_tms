/* eslint-disable import/extensions */
import { shared } from '@appblocks/node-sdk'
import hbs from 'hbs'
import otpTemp from './templates/otp-email-temp.js'

/**
 * @swagger
 * /open_tms_auth/open_tms_auth_be_send_otp_for_verification:
 *   post:
 *     summary: Send otp for verification
 *     description: Send otp for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's  email
 *                 example: appblocksadmin@mailinator.com
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
    prisma,
    validateRequestMethod,
    checkHealth,
    isEmpty,
    redis,
    sendMail,
    generateRandomString,
  } = await shared.getShared()
  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty('email')) {
      return sendResponse(res, 400, {
        message: 'Please provide a Email',
      })
    }

    const user_account = await prisma.user_account.findFirst({
      where: {
        email: requestBody.email,
      },
      include: { user: true },
    })

    if (!user_account) {
      return sendResponse(res, 400, {
        message: 'Invalid User ID',
      })
    }

    const otp = generateRandomString()

    // Store the otp with an expiry stored in env.function in seconds
    if (!redis.isOpen) await redis.connect()
    await redis.set(`${user_account.id}_otp`, otp, {
      EX: Number(process.env.BB_OPEN_TMS_OTP_EXPIRY_TIME_IN_SECONDS),
    })
    await redis.disconnect()

    const emailTemplate = hbs.compile(otpTemp)

    const { user } = user_account

    const message = {
      to: user_account.email,
      from: {
        name: process.env.BB_OPEN_TMS_MAILER_NAME,
        email: process.env.BB_OPEN_TMS_MAILER_EMAIL,
      },
      subject: 'Verify OTP',
      text: 'Please verify your otp',
      html: emailTemplate({
        logo: process.env.BB_OPEN_TMS_LOGO_URL,
        user: user.first_name,
        otp,
      }),
    }
    await sendMail(message)

    return sendResponse(res, 200, {
      data: {
        user_id: user.id,
        user_account_id: user_account.id,
        email: user_account.email,
        name: user.first_name,
      },
      message:
        'We have sent you an email containing One time password to registered email',
    })
  } catch (e) {
    console.log(e.message)
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : 'something went wrong',
    })
  }
}

export default handler
