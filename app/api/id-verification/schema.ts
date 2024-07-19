import { z } from "zod";
// Define the schema for validation
export const IdentityVerificationSchema = z.object({
  id: z.string(),
  cameraImage: z.string(),
  identityDocument: z.string(),
});

export const AdminIdentityVerificationSchema = z.object({
  id: z.string(),
  status: z.enum(["FAILED", "SUCCESS"]),
});

export type IdentityVerification = z.infer<typeof IdentityVerificationSchema>;
export type AdminIdentityVerificationInterface = z.infer<
  typeof AdminIdentityVerificationSchema
>;
