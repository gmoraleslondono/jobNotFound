import z from "zod";
import { searchResponseSchema } from "./schemas.ts";
import { publicProcedure, router } from "./trpc.ts";
import axios from "axios";

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
      console.log("API response:", response.data);
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
});

export type AppRouter = typeof appRouter;
