import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { sendImageToCloudinary } from "../../../helpers/uploader";
import { UserRole } from "@prisma/client";

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
const createDoctor = async (file: any, data: any) => {
  if (file) {
    const uploadToCloudinary = await sendImageToCloudinary(file);

    data.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.doctor.email,
    password: hashPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: data.doctor,
    });

    return createdDoctorData;
  });

  return result;
};
const createPatient = async (file: any, data: any) => {
  if (file) {
    
    const uploadToCloudinary = await sendImageToCloudinary(file);

    data.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.patient.email,
    password: hashPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: data.patient,
    });

    return createdPatientData;
  });

  return result;
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient
};
