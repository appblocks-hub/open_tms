import { hash } from 'bcrypt'
import { shared, env } from '@appblocks/node-sdk'
import otpTemp from './templates/otp-temp.js'
import hbs from 'hbs'
import validateSignupInput from './validation.js'
import { nanoid } from 'nanoid'

env.init()

const handler = async ({ req, res }) => {
  const {
    sendResponse,
    isEmpty,
    prisma,
    validateRequestMethod,
    checkHealth,
    generateRandomString,
    sendMail,
    redis,
  } = await shared.getShared()

  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = req.body

    if (isEmpty(requestBody)) {
      return sendResponse(res, 400, {
        message: 'Please provide the details',
      })
    }

    validateSignupInput(requestBody)

    const emailValid = await prisma.admin_users.findFirst({
      where: { email: requestBody.email },
    })

    if (emailValid) {
      return sendResponse(res, 400, {
        message: 'This email is already in use',
      })
    }

    const password = await hash(requestBody.password, 10)
    const adminu = {
      id: nanoid(),
      full_name: requestBody.first_name + ' ' + requestBody.last_name,
      user_name: requestBody.first_name + requestBody.last_name,
      email: requestBody.email,
      password,
      role: 'admin',
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    console.log(adminu)

    const user = await prisma.admin_users.create({
      data: adminu,
    })

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
        user: adminu.full_name,
        otp,
      }),
    }
    await sendMail(message)

    sendResponse(res, 200, {
      message: 'OTP send to registered email',
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
