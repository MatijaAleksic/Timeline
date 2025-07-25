import { z } from "zod";

export const PeriodFormSchema = z.object({
  title: z.string().min(1, "Title is required"),

  level: z
    .number("Level is required")
    .int()
    .min(1, "Level must be at least 1")
    .max(12, "Level must be at most 12"),
  startDay: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.union([z.number().int().min(1, "Start Day must be at least 1").max(31, "Start Day must be at most 31"), z.null(), z.undefined()]))
    .optional()
    .nullable(),

  startMonth: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.union([z.number().int().min(1, "Start Month must be at least 1").max(12, "Start Month must be at most 12"), z.null(), z.undefined()]))
    .optional()
    .nullable(),

  startYear: z.preprocess((val: number) => {
    if (typeof val === "number" && isNaN(val)) {
      return undefined;
    }
    return val;
  }, z.number("Start Year is required").int()),

  endDay: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.union([z.number().int().min(1, "End Day must be at least 1").max(31, "End Day must be at most 31"), z.null(), z.undefined()]))
    .optional()
    .nullable(),

  endMonth: z
    .preprocess((val: number) => {
      if (typeof val === "number" && isNaN(val)) {
        return undefined;
      }
      return val;
    }, z.union([z.number().int().min(1, "End Month must be at least 1").max(12, "End Month must be at most 12"), z.null(), z.undefined()]))
    .optional()
    .nullable(),

  endYear: z.preprocess((val: number) => {
    if (typeof val === "number" && isNaN(val)) {
      return undefined;
    }
    return val;
  }, z.number("End Year is required").int()),
});
