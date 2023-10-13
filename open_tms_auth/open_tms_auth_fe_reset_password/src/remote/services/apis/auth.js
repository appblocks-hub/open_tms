import { request } from "../request";

const APP_ENTRYPOINT = process.env.BB_OPEN_TMS_AUTH_FUNCTION_URL;

const resetPass = async (values) => {
  const response = await request.put(
    `${APP_ENTRYPOINT}/open_tms_auth_be_reset_password`,
    values
  );
  return response;
};

const auth = {
  resetPass,
};

export default auth;
