import { z } from "zod";

export const ResidenceVerificationSchema = z.object({
  utilityBill: z.string(),
  affidavity: z.string().optional(),
});

export const AdminResidenceVerificationSchema = z.object({
  status: z.enum(["FAILED", "SUCCESS"]),
});

export type ResidenceVerification = z.infer<typeof ResidenceVerificationSchema>;
export type AdminResidenceVerificationInterface = z.infer<
  typeof AdminResidenceVerificationSchema
>;
