import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    password: z.string({ required_error: "password is required" }),
    admin: z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
    }),
  }),
});

const createDoctor = z.object({
  body: z.object({
    password: z.string({ required_error: "password is required" }),
    doctor: z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
      registrationNumber: z.string(),
      gender: z.enum([Gender.MALE, Gender.FEMALE]),
      appointmentFee: z.number(),
      qualification: z.string(),
      currentWorkingPlace: z.string(),
      designation: z.string(),
    }),
  }),
});

const createPatient = z.object({
  body: z.object({
    password: z.string(),
    patient: z.object({
      email: z.string().email(),
      name: z.string(),
      contactNumber: z.string(),
      address: z.string(),
    }),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};
