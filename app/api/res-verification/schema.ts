import { z } from "zod";

export const ResidenceVerificationSchema = z.object({
  id: z.string(),
  utilityBill: z.string().url(),
  affidavity: z.string().optional(),
});
