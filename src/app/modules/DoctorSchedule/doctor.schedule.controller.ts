import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorScheduleServices } from "./doctor.schedule.service";
import pick from "../../../shared/pick";

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
const getMySchedules = catchAsync(async (req, res) => {
  const user = req.user;
  const filters = pick(req.query, ["startDateTime", "endDateTime", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await doctorScheduleServices.getMySchedules(
    filters,
    options,
    user
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Get All Doctor Schedule data successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const {id} = req.params

  const result = await doctorScheduleServices.deleteFromDB(user, id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "MY Schedule deleted successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createIntoDB,
  getMySchedules,
  deleteFromDB,
};
