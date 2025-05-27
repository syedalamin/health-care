import express, { json, NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../../helpers/uploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  upload.single("file"),
 (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.createAdmin),
  userController.createAdmin
);

export const userRoutes = router;
