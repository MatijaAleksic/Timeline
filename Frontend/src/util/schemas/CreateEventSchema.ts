import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),

  level: z.number().refine((val) => typeof val === "number" && !isNaN(val), {
    message: "Level must be a valid number",
  }),

  day: z
    .number()
    .int()
    .min(1, "Day must be at least 1")
    .max(31, "Day must be at most 31")
    .optional(),

  month: z
    .number()
    .int()
    .min(1, "Month must be at least 1")
    .max(12, "Month must be at most 12")
    .optional(),

  year: z.number().int().min(0, "Year must be a positive number"),
});
