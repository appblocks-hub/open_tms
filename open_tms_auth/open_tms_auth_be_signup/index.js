/* eslint-disable import/extensions */
import hbs from 'hbs'
import { genSalt, hash } from 'bcrypt'
import { shared } from '@appblocks/node-sdk'
import otpTemp from './templates/otp-temp.js'
import validateSignupInput from './validation.js'

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

    const password_salt = await genSalt()
    const password_hash = await hash(requestBody.password, 10)

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
      provider: 'password'
    }

    await prisma.$transaction(async (tx) => {
      const userData = await tx.user.create({
        data: user,
      })
      await tx.user_account.create({
        data: { ...user_account, user_id: userData.id },
      })
    })

    const otp = generateRandomString()
    if (!redis.isOpen) await redis.connect()
    await redis.set(`${user_account.id}_otp`, otp, { EX: 600 })
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
