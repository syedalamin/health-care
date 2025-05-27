import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { sendImageToCloudinary } from "../../../helpers/uploader";

const createAdmin = async (file: any, data: any) => {
  if (file) {
    const uploadToCloudinary = await sendImageToCloudinary(file);

    data.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }


  const hashPassword = await bcrypt.hash(data.password, 12);


  const userData = {
    email: data.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
