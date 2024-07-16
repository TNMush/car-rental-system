import { z } from "zod";

// Define Zod schema for Profile
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  locationId: z.number().nullable().optional(),
});
