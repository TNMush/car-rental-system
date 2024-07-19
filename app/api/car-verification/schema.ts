import { z } from "zod";

export const CarVerificationSchema = z.object({
  id: z.string().uuid(),
  proofOfRadioLicense: z.string(),
  proofOfInsurance: z.string(),
});

export const AdminCarVerificationSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["FAILED", "SUCCESS"]),
});

export type CarVerification = z.infer<typeof CarVerificationSchema>;
export type AdminCarVerification = z.infer<typeof AdminCarVerificationSchema>;
