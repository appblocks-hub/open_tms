import { shared, env } from '@appblocks/node-sdk'
import hbs from 'hbs'
import otpTemp from './templates/otp-temp.js'

env.init()
const handler = async ({ req, res }) => {
  const {
    sendResponse,
    codes,
    isEmpty,
    prisma,
    validateRequestMethod,
    generateRandomString,
    sendMail,
    redis,
    checkHealth,
  } = await shared.getShared()
  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody)) {
      sendResponse(res, 400, {
        message: 'Please provide valid email',
      })
      return
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        email: requestBody.email,
      },
    })

    if (!user) {
      sendResponse(res, 400, {
        message: 'Please enter a valid user id',
      })
      return
    }

    const otp = generateRandomString()
    if (!redis.isOpen) await redis.connect()
    await redis.set(`${user.id}_otp`, otp, { EX: 600 })
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
        logo: process.env.LOGO_URL,
        user: user.full_name,
        otp,
      }),
    }
    await sendMail(message)

    sendResponse(res, 200, {
      message: 'OTP resend successfully',
    })
  } catch (e) {
    console.log(e.message)
    if (e.errorCode && e.errorCode < 500) {
      sendResponse(res, e.errorCode, {
        message: e.message,
      })
    } else {
      sendResponse(res, 500, {
        message: 'failed',
      })
    }
  }
}

export default handler
