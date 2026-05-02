import z from "zod";
import {
  searchResponseSchema,
  jobAdSearchResultSchema,
} from "./arbetsförmedlingensSchemas.ts";
import { publicProcedure, router } from "./trpc.ts";
import { db } from "./db.ts";

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

const searchResponseWithStatusSchema = searchResponseSchema.extend({
  hits: z.array(jobWithStatusSchema),
});

const JOB_SEARCH_BASE_API = "https://jobsearch.api.jobtechdev.se";

export const appRouter = router({
  getJobs: publicProcedure.query(async () => {
    try {
      const queryParams = new URLSearchParams({
        municipality: "AvNB_uwa_6n6",
        q: "frontend",
        offset: "0",
        limit: "100",
      });

      const response = await fetch(
        `${JOB_SEARCH_BASE_API}/search?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch job listings: ${response.status}`);
      }

      const data = await response.json();
      const searchResponse = searchResponseSchema.parse(data);

      await db.read();
      const jobsWithStatus = searchResponse.hits.map((job) => {
        const appliedJob = db.data?.appliedJobs?.find((j) => j.id === job.id);
        const isFavorite = db.data?.favorites?.some((f) => f.id === job.id);
        return {
          ...job,
          status: appliedJob?.status,
          isFavorite: isFavorite ?? false,
        };
      });

      return searchResponseWithStatusSchema.parse({
        ...searchResponse,
        hits: jobsWithStatus,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.issues);
        throw error;
      }
      console.error("Error fetching job listings:", error);
      throw new Error("An error occurred while fetching job listings.");
    }
  }),

  getJob: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    try {
      const response = await fetch(`${JOB_SEARCH_BASE_API}/ad/${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch job details: ${response.status}`);

      const data = await response.json();
      const jobAdSearchResult = jobAdSearchResultSchema.parse(data);

      await db.read();
      const job = db.data?.appliedJobs?.find((j) => j.id === id);
      const isFavorite = db.data?.favorites?.some((f) => f.id === id);

      return jobWithStatusSchema.parse({
        ...jobAdSearchResult,
        status: job?.status,
        isFavorite: isFavorite ?? false,
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw new Error("An error occurred while fetching job details.");
    }
  }),

  applyToJob: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: jobStatusSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db.read();
        const existing = db.data?.appliedJobs?.find((j) => j.id === input.id);
        if (existing) {
          existing.status = input.status;
        } else {
          db.data.appliedJobs.push({ id: input.id, status: input.status });
        }
        await db.write();
      } catch {
        // ignore
      }
    }),

  getAppliedStatusById: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        await db.read();
        const job = db.data?.appliedJobs?.find((j) => j.id === id);
        return { status: job?.status };
      } catch {
        return { status: null };
      }
    }),

  getIsFavoriteById: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        await db.read();
        const isFavorite = db.data?.favorites?.some((f) => f.id === id);
        return isFavorite;
      } catch {
        return false;
      }
    }),

  toggleFavorite: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.read();
        const index = db.data?.favorites?.findIndex((f) => f.id === input.id);
        if (index !== undefined) {
          if (index >= 0) {
            db.data?.favorites?.splice(index, 1);
          } else {
            db.data?.favorites?.push({ id: input.id });
          }
          await db.write();
        }
      } catch {
        // ignore
      }
    }),

  getFavorites: publicProcedure.query(async () => {
    try {
      await db.read();
      return db.data?.favorites;
    } catch {
      return [];
    }
  }),
});

export type AppRouter = typeof appRouter;
