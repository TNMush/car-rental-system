import { z } from "zod";

export const carSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  type: z.string(),
  color: z.string(),
  regNumber: z.string(),
  frontView: z.string(),
  backView: z.string(),
  sideView: z.string(),
  interiorView1: z.string(),
  interiorView2: z.string().optional(),
  interiorView3: z.string().optional(),
});

export const AdminCarSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
});

export type Car = z.infer<typeof carSchema>;
