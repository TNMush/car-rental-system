import { z } from "zod";

// Schema for CreateListingInterface
export const createListingSchema = z.object({
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format for 'from'"),
  upTo: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format for 'upTo'"),
  pricing: z.number().positive("Pricing must be a positive number"),
  listedBy: z.string().uuid("Invalid UUID for 'listedBy'"),
});

// Schema for listingRequestInterface
export const listingRequestSchema = z.object({
  location: z.string().optional(),
  type: z.string().optional(),
  from: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid date format for 'from'"
    ),
  to: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid date format for 'to'"
    ),
});

//Schema for Patching Listing
export const patchingListingSchema = z.object({
  id: z.string().min(1, "ID is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  from: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format for 'from'",
      path: ["from"],
    }),
  upTo: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format for 'upTo'",
      path: ["upTo"],
    }),
  pricing: z.number().optional(),
});
