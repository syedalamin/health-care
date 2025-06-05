import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { patientServices } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";


const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await patientServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient is retrieve successfully",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
 
  const result = await patientServices.updateIntoDB(id,  req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient is updated successfully",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
 
  const result = await patientServices.deleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient is deleted successfully",
    data: result,
  });
});
const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
 
  const result = await patientServices.softDelete(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient is soft deleted successfully",
    data: result,
  });
});
export const patientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete

};
