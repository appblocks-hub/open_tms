import { request } from '../request'

const APP_ENTRYPOINT = process.env.BB_OPEN_TMS_AUTH_FUNCTION_URL

const register = async (values) => {
  const response = await request.post(`${APP_ENTRYPOINT}/open_tms_auth_be_signup`, values)
  return response
}

const auth = {
  register,
}

export default auth
