import exp from "constants";
import { date, z } from "zod";

export const RentalSchema = z.object({
  id: z.string().uuid(),
  listingId: z.string(),
  renterId: z.string(),
  dateOfCollection: z.string(),
  dateOfReturn: z.string(),
  priceCharged: z.number(),
});

export type Rental = z.infer<typeof RentalSchema>;
