import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../backend/appRouter";
import { useTRPC } from "./trpc";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;
type ToggleFavoriteInput = RouterInputs["toggleFavorite"];
type JobsResponse = RouterOutputs["getJobs"];
type JobDetail = RouterOutputs["getJob"];

export const JOBS_QUERY_PREFIX = ["jobs"] as const;

const toggleFavoriteInJobs = (jobs: JobsResponse, id: string): JobsResponse => ({
  ...jobs,
  hits: jobs.hits.map((job) =>
    job.id === id ? { ...job, isFavorite: !job.isFavorite } : job
  ),
});

const toggleFavoriteInJobDetail = (
  job: JobDetail | undefined,
  id: string
): JobDetail | undefined => {
  if (!job || job.id !== id) return job;
  return { ...job, isFavorite: !job.isFavorite };
};

export function useToggleFavorite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation(
    trpc.toggleFavorite.mutationOptions({
      onMutate: (variables: ToggleFavoriteInput) => {
        if (!variables) return;
        const { id } = variables;

        queryClient.setQueryData(
          trpc.getJobs.queryOptions().queryKey,
          (old: JobsResponse | undefined) => {
            if (!old) return old;
            return toggleFavoriteInJobs(old, id);
          }
        );

        queryClient.setQueriesData(
          { queryKey: [...JOBS_QUERY_PREFIX] },
          (old: JobsResponse | undefined) => {
            if (!old) return old;
            return toggleFavoriteInJobs(old, id);
          }
        );

        queryClient.setQueryData(
          trpc.getJob.queryOptions(id).queryKey,
          (old: JobDetail | undefined) => toggleFavoriteInJobDetail(old, id)
        );
      },
      onSuccess: (_data, variables) => {
        if (!variables) return;
        queryClient.invalidateQueries(trpc.getJobs.queryOptions());
        queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_PREFIX] });
        queryClient.invalidateQueries(trpc.getFavorites.queryOptions());
        queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
        queryClient.invalidateQueries(trpc.getIsFavoriteById.queryFilter());
        queryClient.invalidateQueries(trpc.getJob.queryFilter(variables.id));
      },
    })
  );

  const handleToggleFavorite = (id: string) => toggleFavorite.mutate({ id });

  return { handleToggleFavorite, isTogglingFavorite: toggleFavorite.isPending };
}
