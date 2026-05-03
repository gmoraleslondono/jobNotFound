import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../backend/appRouter";
import { useTRPC } from "./trpc";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;
type ToggleFavoriteInput = RouterInputs["toggleFavorite"];
type JobsResponse = RouterOutputs["getJobs"];

/** Must match Home's useInfiniteQuery `queryKey`. */
export const HOME_INFINITE_JOBS_QUERY_KEY = ["jobs", "infinite"] as const;

export function useToggleFavorite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation(
    trpc.toggleFavorite.mutationOptions({
      onMutate: (variables: ToggleFavoriteInput) => {
        if (!variables) return;

        const flipFavorite = (job: JobsResponse["hits"][number]) =>
          job.id === variables.id
            ? { ...job, isFavorite: !job.isFavorite }
            : job;

        queryClient.setQueryData(
          trpc.getJobs.queryOptions().queryKey,
          (old: JobsResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              hits: old.hits.map(flipFavorite),
            };
          }
        );

        queryClient.setQueryData(
          HOME_INFINITE_JOBS_QUERY_KEY,
          (old: InfiniteData<JobsResponse, number> | undefined) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                hits: page.hits.map(flipFavorite),
              })),
            };
          }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getJobs.queryOptions());
        queryClient.invalidateQueries({ queryKey: [...HOME_INFINITE_JOBS_QUERY_KEY] });
        queryClient.invalidateQueries(trpc.getFavorites.queryOptions());
        queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
        queryClient.invalidateQueries(trpc.getIsFavoriteById.queryFilter());
      },
    })
  );

  const handleToggleFavorite = (id: string) => toggleFavorite.mutate({ id });

  return { handleToggleFavorite, isTogglingFavorite: toggleFavorite.isPending };
}
