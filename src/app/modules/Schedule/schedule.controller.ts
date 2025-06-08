import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { scheduleServices } from "./schedule.service";

const createIntoDB = catchAsync(async (req, res) => {
  const result = await scheduleServices.createIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedule data created successfully",
    data: result,
  });
});

export const scheduleController = {
  createIntoDB,
};
