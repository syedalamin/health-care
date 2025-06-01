import express, { NextFunction, Request, Response } from "express";

import { upload } from "../../../helpers/uploader";
import { doctorControllers } from "./doctor.controller";

const router = express.Router();

router.patch(
  "/:id",
  //   auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  doctorControllers.updateIntoDB
);

export const doctorRoutes = router;
