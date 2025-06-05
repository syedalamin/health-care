import { Patient, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../helpers/calculatePagination";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAdminFilterRequest } from "../Admin/admin.interface";
import { patientSearchableFields } from "./patient.constant";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, sortBy, sortOrder, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.PatientWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return result;
};
const updateIntoDB = async (
  id: string,
  payload: any
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    // update patient data
    await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // create or update patient health data

    if (patientHealthData) {
      const healthData = await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }

    // medical report  create or update
    if (medicalReport) {
      const reportData = await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    // delete  medical report
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // patient health data
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    // delete patient
    const deletedPatient = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    // user delete
    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });
  return result;
};


const softDelete = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });
  return result;
};

export const patientServices = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
