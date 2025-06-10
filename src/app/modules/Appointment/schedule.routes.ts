import express from "express";
import { appointmentController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();


router.post("/", auth(UserRole.PATIENT), appointmentController.createIntoDB);

export const appointmentRouters = router;

