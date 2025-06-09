import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/calculatePagination";
import { Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import status from "http-status";

const createIntoDB = async (
  user: JwtPayload,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
    isBooked: false,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
  return result;
};

const getMySchedules = async (
  params: any,
  options: IPaginationOptions,
  user: JwtPayload
) => {
  const { limit, sortBy, sortOrder, page, skip } = calculatePagination(options);
  const { startDateTime, endDateTime, ...filterData } = params;
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime,
          },
        },
        {
          endDateTime: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    // orderBy:
    //   sortBy && sortOrder
    //     ? {
    //         [sortBy]: sortOrder,
    //       }
    //     : {
    //         doctorId: "asc",
    //       },
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteFromDB = async (user: JwtPayload, id: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: id,

      isBooked: true,
    },
  });
  if (isBookedSchedule) {
    throw new AppError(
      status.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked "
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
    },
  });

  return result;
};
export const doctorScheduleServices = {
  createIntoDB,
  getMySchedules,
  deleteFromDB,
};
