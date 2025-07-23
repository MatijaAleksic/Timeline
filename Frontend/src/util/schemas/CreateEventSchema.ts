import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),

  level: z
    .number("Level is required")
    .int()
    .min(1, "Level must be at least 1")
    .max(12, "Level must be at most 12"),
  day: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.number().int().min(1, "Day must be at least 1").max(31, "Day must be at most 31").optional())
    .optional(),

  month: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.number().int().min(1, "Month must be at least 1").max(12, "Month must be at most 12").optional())
    .optional(),

  year: z.preprocess((val: number) => {
    if (typeof val === "number" && isNaN(val)) {
      return undefined;
    }
    return val;
  }, z.number("Year is required").int()),
});
