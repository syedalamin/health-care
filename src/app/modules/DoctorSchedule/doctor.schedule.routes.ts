import express from "express";
import { doctorScheduleController } from "./doctor.schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), doctorScheduleController.createIntoDB);

export const doctorScheduleRouters = router;

