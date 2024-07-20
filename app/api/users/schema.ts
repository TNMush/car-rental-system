import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short "),
});

export type User = z.infer<typeof UserSchema>;
