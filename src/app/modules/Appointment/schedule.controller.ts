import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { appointmentServices } from "./schedule.service";


const createIntoDB = catchAsync(async (req, res) => {

  const result = await appointmentServices.createIntoDB(req.user,req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment data created successfully",
    data: result,
  });
});


export const appointmentController = {
  createIntoDB,

};
