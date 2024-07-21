import { z } from "zod";

export const ListingSchema = z.object({
  from: z.string(),
  upTo: z.string(),
  pricing: z.number(),
});

export type Listing = z.infer<typeof ListingSchema>;
