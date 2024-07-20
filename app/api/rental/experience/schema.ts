import { z } from "zod";

export const ExperienceSchema = z.object({
  reviewerId: z.string(),
  rentalId: z.string(),
  rating: z.number().optional(),
  comment: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
