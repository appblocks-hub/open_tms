import { request } from "../request";

const APP_ENTRYPOINT = process.env.BB_OPEN_TMS_AUTH_FUNCTION_URL;

const forgotPass = async (values) => {
  const response = await request.post(
    `${APP_ENTRYPOINT}/open_tms_auth_be_forgot_password`,
    values
  );
  return response;
};

const auth = {
  forgotPass,
};

export default auth;
