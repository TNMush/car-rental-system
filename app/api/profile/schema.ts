import { z } from "zod";

// Define Zod schema for Profile
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().nullable(),
  bio: z.string().nullable(),
  locationId: z.number().nullable(),
});
