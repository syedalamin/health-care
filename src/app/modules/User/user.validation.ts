import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    password: z.string({ required_error: "password is required" }),
    admin: z.object({
      name: z.string(),
      email: z.string(),
      contactNumber: z.string(),
    }),
  }),
});

export const userValidation = {
  createAdmin,
};
