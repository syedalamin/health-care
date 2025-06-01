import { sendImageToCloudinary } from "../../../helpers/uploader";
import prisma from "../../../shared/prisma";

const createIntoDB = async (file: any, payload: any) => {
  if (file) {
    const uploadToCloudinary = await sendImageToCloudinary(file);

    payload.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

const getDataFromDB = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};
const deleteSingleDataFromDB = async (id: string) => {
  const specialtiesInfo = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialties.delete({
    where: {
      id: specialtiesInfo.id,
    },
  });

  return result;
};

export const SpecialtiesServices = {
  createIntoDB,
  getDataFromDB,
  deleteSingleDataFromDB,
};
