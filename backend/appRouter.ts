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
          q: z.string().min(1).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const q = input?.q?.trim() || DEFAULT_JOB_SEARCH_Q;
        const useDefaultMultiRoleQuery = !input?.q?.trim();
        const queryParams = new URLSearchParams({
          municipality: "AvNB_uwa_6n6" /* Stockholm */,
          q,
          offset: "0",
          limit: "100",
          sort: "pubdate-desc" /* Newest published ads first */,
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

  removeJobApplication: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.read();
        const applied = db.data?.appliedJobs ?? [];
        const next = applied.filter((j) => j.id !== input.id);

        if (db.data) db.data.appliedJobs = next;
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

  addToFavorites: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.read();
        const favorites = db.data?.favorites ?? [];
        const alreadyFavorite = favorites.some((f) => f.id === input.id);

        if (!alreadyFavorite) {
          favorites.push({ id: input.id });
        }

        if (db.data) db.data.favorites = favorites;
        await db.write();
      } catch {
        // ignore
      }
    }),

  removeFromFavorites: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.read();
        const favorites = db.data?.favorites ?? [];
        const nextFavorites = favorites.filter((f) => f.id !== input.id);

        if (db.data) db.data.favorites = nextFavorites;
        await db.write();
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
