import z from "zod";
import { jobAdSearchResultSchema } from "./arbetsförmedlingensSchemas.ts";

const jobStatusSchema = z.enum([
  "applied",
  "interviewing",
  "declined",
  "hired",
]);

const jobWithStatusSchema = jobAdSearchResultSchema.extend({
  isFavorite: z.boolean().optional(),
  status: jobStatusSchema.optional(),
});

export { jobStatusSchema, jobWithStatusSchema };
