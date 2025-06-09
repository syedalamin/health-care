import express from "express";
import { doctorScheduleController } from "./doctor.schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleController.getMySchedules
);
router.post(
  "/create-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleController.createIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleController.deleteFromDB
);
export const doctorScheduleRouters = router;
