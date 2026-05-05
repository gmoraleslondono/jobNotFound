import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../backend/appRouter";
import { useTRPC } from "./trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type JobDetail = RouterOutputs["getJob"];
type JobsResponse = RouterOutputs["getJobs"];
export const JOBS_QUERY_PREFIX = ["jobs"] as const;

export function useToggleFavorite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const applyOptimisticFavorite = (id: string, isFavorite: boolean) => {
    queryClient.setQueriesData(
      { queryKey: [...JOBS_QUERY_PREFIX] },
      (old: JobsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          hits: old.hits.map((job) =>
            job.id === id ? { ...job, isFavorite } : job
          ),
        };
      }
    );

    queryClient.setQueryData(
      trpc.getJob.queryOptions(id).queryKey,
      (old: JobDetail | undefined) => {
        if (!old || old.id !== id) return old;
        return { ...old, isFavorite };
      }
    );
  };

  const invalidateFavoriteQueries = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_PREFIX] });
    queryClient.invalidateQueries(trpc.getFavorites.queryOptions());
    queryClient.invalidateQueries(trpc.getJob.queryOptions(id));
  };

  const addToFavorites = useMutation(
    trpc.addToFavorites.mutationOptions({
      onMutate: (variables) => {
        if (!variables) return;
        applyOptimisticFavorite(variables.id, true);
      },
      onSuccess: (_data, variables) => {
        if (!variables) return;
        invalidateFavoriteQueries(variables.id);
      },
    })
  );

  const removeFromFavorites = useMutation(
    trpc.removeFromFavorites.mutationOptions({
      onMutate: (variables) => {
        if (!variables) return;
        applyOptimisticFavorite(variables.id, false);
      },
      onSuccess: (_data, variables) => {
        if (!variables) return;
        invalidateFavoriteQueries(variables.id);
      },
    })
  );

  const handleToggleFavorite = (job: Pick<JobDetail, "id" | "isFavorite">) => {
    if (job.isFavorite) {
      removeFromFavorites.mutate({ id: job.id });
      return;
    }
    addToFavorites.mutate({ id: job.id });
  };

  return {
    handleToggleFavorite,
    isTogglingFavorite: addToFavorites.isPending || removeFromFavorites.isPending,
  };
}
