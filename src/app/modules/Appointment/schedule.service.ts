import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

const createIntoDB = async (user: JwtPayload, payload: any) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const doctorScheduleInfo = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorInfo.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    const doctorScheduleData = await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorInfo.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();
    const transactionId =
      "ph-health-care-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getHours() +
      "-" +
      today.getDate() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();
    const payment = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorInfo.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

export const appointmentServices = {
  createIntoDB,
};
