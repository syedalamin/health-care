import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";

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

export const doctorScheduleServices = {
  createIntoDB,
};
