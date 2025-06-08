import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorScheduleServices } from "./doctor.schedule.service";


const createIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await doctorScheduleServices.createIntoDB(user, req.body);


  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor Schedule data created successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createIntoDB,
};
