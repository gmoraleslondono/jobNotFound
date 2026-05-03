import z from "zod";
import {
  searchResponseSchema,
  jobAdSearchResultSchema,
} from "./arbetsförmedlingensSchemas.ts";
import { jobStatusSchema, jobWithStatusSchema } from "./schemas.ts";
import { publicProcedure, router } from "./trpc.ts";
import { db } from "./db.ts";

const searchResponseWithStatusSchema = searchResponseSchema.extend({
  hits: z.array(jobWithStatusSchema),
});

const JOB_SEARCH_BASE_API = "https://jobsearch.api.jobtechdev.se";

const DEFAULT_JOB_SEARCH_KEYWORDS = [
  "frontend",
  "backend",
  "fullstack",
  "developer",
  "programmerare",
  "mjukvaruutvecklare",
  "systemutvecklare",
  "programvaruutvecklare",
  "mjukvaruingenjör",
] as const;

const DEFAULT_JOB_SEARCH_Q = DEFAULT_JOB_SEARCH_KEYWORDS.join(" ");

export const appRouter = router({
  getJobs: publicProcedure
    .input(
      z
        .object({
          offset: z.number().int().min(0).default(0),
          limit: z.number().int().min(1).max(100).default(20),
          q: z.string().min(1).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const offset = input?.offset ?? 0;
        const limit = input?.limit ?? 20;
        const q = input?.q?.trim() || DEFAULT_JOB_SEARCH_Q;
        const useDefaultMultiRoleQuery = !input?.q?.trim();
        const queryParams = new URLSearchParams({
          municipality: "AvNB_uwa_6n6",
          q,
          offset: offset.toString(),
          limit: limit.toString(),
          /** Newest published ads first (API default is relevance). */
          sort: "pubdate-desc",
        });

        const response = await fetch(
          `${JOB_SEARCH_BASE_API}/search?${queryParams.toString()}`,
          {
            headers: {
              accept: "application/json",
              "x-feature-freetext-bool-method": "or",
              ...(useDefaultMultiRoleQuery
                ? { "x-feature-disable-smart-freetext": "true" }
                : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch job listings: ${response.status}`);
        }

        const data = await response.json();
        const pageResponse = searchResponseSchema.parse(data);

        await db.read();
        const jobsWithStatus = pageResponse.hits.map((job) => {
          const appliedJob = db.data?.appliedJobs?.find((j) => j.id === job.id);
          const isFavorite = db.data?.favorites?.some((f) => f.id === job.id);
          return {
            ...job,
            status: appliedJob?.status,
            isFavorite: isFavorite ?? false,
          };
        });

        return searchResponseWithStatusSchema.parse({
          ...pageResponse,
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
      })
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

  getJobApplications: publicProcedure.query(async () => {
    try {
      await db.read();
      return db.data?.appliedJobs;
    } catch {
      return [];
    }
  }),
});

export type AppRouter = typeof appRouter;
