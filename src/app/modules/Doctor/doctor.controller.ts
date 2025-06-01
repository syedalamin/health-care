import status from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { doctorServices } from "./doctor.service";

const updateIntoDB = catchAsync(async (req, res) => {


    const {id} = req.params

  const result = await doctorServices.updateIntoDB(id,req.file, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "specialties create successfully",
    data: result,
  });
});

export const doctorControllers = {
  updateIntoDB,
};
