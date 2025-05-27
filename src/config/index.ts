import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_secret_access_token: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwt_secret_refresh_token: process.env.JWT_SECRET_REFRESH_TOKEN,
  jwt_secret_forgot_token: process.env.JWT_SECRET_FORGOT_TOKEN,
  jwt_secret_access_token_expires_in:
    process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRES_IN,
  jwt_secret_refresh_token_expires_in:
    process.env.JWT_SECRET_REFRESH_TOKEN_EXPIRES_IN,
  jwt_secret_forgot_token_expires_in:
    process.env.JWT_SECRET_FORGOT_TOKEN_EXPIRES_IN,

  reset_password_link: process.env.RESET_PASSWORD_LINK,

  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
};
