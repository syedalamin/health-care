import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { scheduleServices } from "./schedule.service";
import pick from "../../../shared/pick";

const createIntoDB = catchAsync(async (req, res) => {
  const result = await scheduleServices.createIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule data created successfully",
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await scheduleServices.getAllFromDB(filters, options, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule data get is successfully",
    data: result,
  });
});

export const scheduleController = {
  createIntoDB,
  getAllFromDB,
};
