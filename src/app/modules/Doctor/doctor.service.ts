import { sendImageToCloudinary } from "../../../helpers/uploader";
import prisma from "../../../shared/prisma";

const updateIntoDB = async (id: string, file: any, payload: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  

  if (file) {
    const uploadToCloudinary = await sendImageToCloudinary(file);

    payload.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.doctor.create({
    data: payload,
  });

  return result;
};

export const doctorServices = {
  updateIntoDB,
};
