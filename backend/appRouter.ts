import z from "zod";
import {
  searchResponseSchema,
  jobAdSearchResultSchema,
  jobStatusSchema,
} from "./arbetsförmedlingensSchemas.ts";
import { publicProcedure, router } from "./trpc.ts";
import axios from "axios";
import { db } from "./db.ts";

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

      const response = await axios.get(
        `${JOB_SEARCH_BASE_API}/search?${queryParams.toString()}`,
      );
      const searchResponse = searchResponseSchema.parse(response.data);
      return searchResponse;
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
      if (!id) {
        throw new Error("Job ID is required to fetch job details.");
      }
      const response = await axios.get(`${JOB_SEARCH_BASE_API}/ad/${id}`);
      const jobAdSearchResult = jobAdSearchResultSchema.parse(response.data);
      return jobAdSearchResult;
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
      await db.read();

      const exists = db.data.applied.some((job) => job.id === input.id);

      if (exists) {
        return;
      }

      db.data.applied.push({
        id: input.id,
        status: input.status,
      });
      await db.write();
    }),
});

export type AppRouter = typeof appRouter;
