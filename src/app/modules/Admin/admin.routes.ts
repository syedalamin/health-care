import express from "express";
import { adminController } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAllFromDB
);
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(adminValidationSchema.updateSchema),
  adminController.updateByIdIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.deleteFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.softDeleteFromDB
);

export const adminRoutes = router;
