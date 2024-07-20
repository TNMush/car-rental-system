import { z } from "zod";

// Define Zod schema for Profile
export const ProfileSchema = z.object({
  name: z.string(),
  profilePicture: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Define Zod schema for Patching Profile (Profile with name optional)
export const PatchingProfileSchema = ProfileSchema.omit({ name: true }).merge(
  z.object({ name: z.string().optional() })
);

export type PatchingProfile = z.infer<typeof PatchingProfileSchema>;
