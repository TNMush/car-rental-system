import { z } from "zod";
// Define the schema for validation
export const IdentityVerificationSchema = z.object({
  id: z.string(),
  cameraImage: z.string().url(),
  identityDocument: z.string().url(),
});
