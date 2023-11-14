/* eslint-disable import/extensions */
import { shared, env } from '@appblocks/node-sdk'
import hbs from 'hbs'
import otpTemp from './templates/otp-temp.js'

env.init()

/**
 * @swagger
 * /open_tms_auth/open_tms_auth_be_resend_email_otp:
 *   post:
 *     summary: Resend otp for a given email
 *     description: Resend otp for a given email
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
 *                 example: appblocksadmin@mailinator.com
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 */
const handler = async ({ req, res }) => {
  const { sendResponse, isEmpty, prisma, validateRequestMethod, generateRandomString, sendMail, redis, checkHealth } =
    await shared.getShared()
  try {
    // health check
    if (checkHealth(req, res)) return {}

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: 'Please provide valid email',
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
        message: 'Please enter a valid user id',
      })
    }

    const { user } = user_account

    const otp = generateRandomString()
    if (!redis.isOpen) await redis.connect()
    await redis.set(`${user_account.id}_otp`, otp, {
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
      message: 'OTP resend successfully',
    })
  } catch (e) {
    console.log(e.message)
    return sendResponse(res, e.errorCode ? e.errorCode : 500, {
      message: e.errorCode < 500 ? e.message : 'something went wrong',
    })
  }
}

export default handler
