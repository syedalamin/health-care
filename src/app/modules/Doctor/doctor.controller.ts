import status from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { doctorServices } from "./doctor.service";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";



const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await doctorServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor is retrieve successfully",
    data: result,
  });
});


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
  getAllFromDB,
  getByIdFromDB
};
