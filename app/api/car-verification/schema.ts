import { z } from "zod";

export const CarVerificationSchema = z.object({
  proofOfRadioLicense: z.string(),
  proofOfInsurance: z.string(),
});

export const AdminCarVerificationSchema = z.object({
  status: z.enum(["FAILED", "SUCCESS"]),
});

export type CarVerification = z.infer<typeof CarVerificationSchema>;
export type AdminCarVerification = z.infer<typeof AdminCarVerificationSchema>;
