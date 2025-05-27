import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpers/jwtToken";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { sendEmail } from "./emailSender";
import AppError from "../../errors/AppError";
import status from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Authentication failed");
  }

  const payloadData = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    payloadData,
    config.jwt_secret_access_token as string,
    config.jwt_secret_access_token_expires_in as string
  );

  const refreshToken = generateToken(
    payloadData,
    config.jwt_secret_refresh_token as string,
    config.jwt_secret_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, "abcdefghijkl");
  } catch (err) {
    throw new Error("You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const payloadData = {
    email: userData?.email,
    role: decodedData?.role,
  };

  const accessToken = generateToken(
    payloadData,
    config.jwt_secret_access_token as string,
    config.jwt_secret_access_token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Authentication failed");
  }

  const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "password change ",
  };
};

const forgotPassword = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const forgetPasswordToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt_secret_forgot_token as string,
    config.jwt_secret_forgot_token_expires_in as string
  );

  const forgotPasswordLink =
    config.reset_password_link +
    `?userId=${userData.id}&token=${forgetPasswordToken}`;

  // console.log(forgotPasswordLink)

  await sendEmail(
    userData.email,
    `
    <div>
    <p>Dear User</p>
    <p>Your Password Reset Link 
      <a href=${forgotPasswordLink}>
       <button>
         Reset Password
       </button>
      </a>
    </p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log({ token, payload });

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.jwt_secret_forgot_token as string
  );

  if (!isValidToken) {
    throw new AppError(status.FORBIDDEN, "forbidden");
  }

  const hashPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });

  console.log(isValidToken);
};
export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
//  await sendEmail(
//     userData.email,
//     `
//     <div>
//     <p>Dear User</p>
//     <p>Your Password Reset Link
//       <a href=${forgetPasswordToken}>
//        <button>
//          Reset Password
//        </button>
//       </a>
//     </p>
//     </div>
//     `
//   );
