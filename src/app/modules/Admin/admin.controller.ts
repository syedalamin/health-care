
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";


const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is retrieve successfully",
    data: result,
  });
});

const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updateByIdIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is update successfully",
    data: result,
  });
  res.status(200).json({});
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is soft Delete successfully",
    data: result,
  });
});

export const adminController = {
  getAllFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
