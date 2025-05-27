import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.refreshToken);
router.patch(
  "/changePassword",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.changePassword
);
router.patch("/forgotPassword", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);

export const authRoutes = router;
