import { z } from "zod";

export const ResidenceVerificationSchema = z.object({
  id: z.string(),
  utilityBill: z.string().url(),
  affidavity: z.string().optional(),
});

export const AdminResidenceVerificationSchema = z.object({
  id: z.string(),
  status: z.enum(["FAILED", "SUCCESS"]),
});

export type ResidenceVerification = z.infer<typeof ResidenceVerificationSchema>;
export type AdminResidenceVerificationInterface = z.infer<
  typeof AdminResidenceVerificationSchema
>;
