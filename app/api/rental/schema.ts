import { z } from "zod";

export const RentalSchema = z.object({
  dateOfCollection: z.string(),
  dateOfReturn: z.string(),
  priceCharged: z.number(),
});

export type Rental = z.infer<typeof RentalSchema>;
