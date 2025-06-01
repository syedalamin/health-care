import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesServices } from "./specialties.service";

const createIntoDB = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.createIntoDB(req.file, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "specialties create successfully",
    data: result,
  });
});
const getDataFromDB = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.getDataFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "specialties retrieved successfully",
    data: result,
  });
});
const deleteSingleDataFromDB = catchAsync(async (req, res) => {
  const {id} = req.params
  const result = await SpecialtiesServices.deleteSingleDataFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "specialties delete successfully",
    data: result,
  });
});

export const SpecialtiesControllers = {
  createIntoDB,
  getDataFromDB,
  deleteSingleDataFromDB
};
