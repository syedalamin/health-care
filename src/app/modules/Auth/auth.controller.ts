import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "refresh Token is  successfully",
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await authServices.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "change password is  successfully",
    data: result,
  });
});
const forgotPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "forgot password is  successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";

  await authServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "reset password is  successfully",
    data: null,
  });
});
export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
