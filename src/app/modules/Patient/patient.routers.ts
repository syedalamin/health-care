import express from "express";

import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.getAllFromDB
);
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.updateIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.deleteFromDB
);
router.delete(
  "/:id/soft",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.softDelete
);

export const patientRoutes = router;