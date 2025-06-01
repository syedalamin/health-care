import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesControllers } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { SpecialtiesValidation } from "./specialties.validation";
const router = express.Router();

router.post(
  "/create-specialties",
  //   auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(SpecialtiesValidation.createSpecialties),
  SpecialtiesControllers.createIntoDB
);
router.get("/", SpecialtiesControllers.getDataFromDB);
router.delete("/:id", SpecialtiesControllers.deleteSingleDataFromDB);

export const SpecialtiesRoutes = router;
