import express from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), scheduleController.getAllFromDB);
router.post("/", scheduleController.createIntoDB);

export const scheduleRouters = router;

// const getAllFromDB = catchAsync(async (req, res) => {
//   const filters = pick(req.query, adminFilterableFields);
//   const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

//   const result = await adminServices.getAllFromDB(filters, options);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Admin data retrieved successfully",
//     meta: result.meta,
//     data: result.data,
//   });
// });
