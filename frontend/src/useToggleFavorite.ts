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

        queryClient.setQueriesData(
          { queryKey: [...JOBS_QUERY_PREFIX] },
          (old: JobsResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              hits: old.hits.map(flipFavorite),
            };
          }
        );

        queryClient.setQueryData(
          trpc.getJob.queryOptions(variables.id).queryKey,
          (old: JobDetail | undefined) => {
            if (!old || old.id !== variables.id) return old;
            return { ...old, isFavorite: !old.isFavorite };
          }
        );
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(trpc.getJobs.queryOptions());
        queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_PREFIX] });
        queryClient.invalidateQueries(trpc.getFavorites.queryOptions());
        queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
        queryClient.invalidateQueries(trpc.getIsFavoriteById.queryFilter());
        const jobId =
          variables && typeof variables === "object" && "id" in variables
            ? variables.id
            : undefined;
        if (jobId) {
          queryClient.invalidateQueries(trpc.getJob.queryFilter(jobId));
        }
      },
    })
  );

  const handleToggleFavorite = (id: string) => toggleFavorite.mutate({ id });

  return { handleToggleFavorite, isTogglingFavorite: toggleFavorite.isPending };
}
