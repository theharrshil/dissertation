import { z } from "zod";

export const ProjectValidator = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      ownerId: z.string().nullable(),
      isReserved: z.boolean(),
      developerId: z.string().nullable(),
      image: z.string().nullable(),
      address: z.string(),
      createdAt: z.string(),
      postcode: z.string(),
      price: z.string(),
      currency: z.string(),
    })
  ),
  success: z.boolean(),
});
