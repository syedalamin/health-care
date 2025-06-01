import { z } from "zod";

const createSpecialties = z.object({
  body: z.object({
    title: z.string(),
  }),
});

export const SpecialtiesValidation = {
  createSpecialties,
};
