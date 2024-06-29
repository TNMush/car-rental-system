import { z } from "zod";

export const createProfileSchema = z.object({
  userId: z.string().uuid(), // Assuming userId is a UUID
  name: z.string().min(1, { message: "Name is required" }),
  profilePicture: z.string().url().optional(), // Assuming it's a URL
  bio: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  proofOfResidence: z.string().optional(),
  proofOfIdentity: z.string().optional(),
});
export const editProfileSchema = z.object({
  userId: z.string().uuid(), // Assuming userId is a UUID
  profilePicture: z.string().url().optional(), // Assuming it's a URL
  bio: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  proofOfResidence: z.string().optional(),
  proofOfIdentity: z.string().optional(),
});

export type editProfileInterface = z.infer<typeof editProfileSchema>;
