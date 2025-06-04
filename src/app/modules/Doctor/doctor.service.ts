import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../helpers/calculatePagination";
import { sendImageToCloudinary } from "../../../helpers/uploader";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IDoctorFilterRequest } from "./doctor.interface";
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (
  params: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, sortBy, sortOrder, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
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
  });
  const total = await prisma.doctor.count({
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

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const updateIntoDB = async (id: string, file: any, payload: any) => {
  const { specialties, ...updateData } = payload;

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (file) {
    const uploadToCloudinary = await sendImageToCloudinary(file);

    payload.icon = uploadToCloudinary?.secure_url;
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id: doctorData.id,
      },
      data: updateData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialties && specialties.length > 0) {
      // delete
      const deletedSpecialtiesIds = specialties.filter(
        (specialty: { isDeleted: any }) => specialty.isDeleted
      );
      for (const specialty of deletedSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorData.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      // create

      const createSpecialtiesIds = specialties.filter(
        (specialty: { isDeleted: any }) => !specialty.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorData.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
        console.log(specialty);
      }
    }
  });

  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorData.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};


const deleteFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });

    return doctorDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const userDeletedData = await transactionClient.user.update({
      where: {
        email: doctorDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return doctorDeletedData;
  });
  return result;
};

export const doctorServices = {
  updateIntoDB,
  getAllFromDB,
  getByIdFromDB,
  softDeleteFromDB,
  deleteFromDB
};
