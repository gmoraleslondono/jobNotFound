import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../backend/appRouter";
import { useTRPC } from "./trpc";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;
type ToggleFavoriteInput = RouterInputs["toggleFavorite"];
type JobsResponse = RouterOutputs["getJobs"];

export function useToggleFavorite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation(
    trpc.toggleFavorite.mutationOptions({
      onMutate: (variables: ToggleFavoriteInput) => {
        if (!variables) return;

        queryClient.setQueryData(
          trpc.getJobs.queryOptions().queryKey,
          (old: JobsResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              hits: old.hits.map((job) =>
                job.id === variables.id
                  ? { ...job, isFavorite: !job.isFavorite }
                  : job
              ),
            };
          }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getJobs.queryOptions());
        queryClient.invalidateQueries(trpc.getFavorites.queryOptions());
        queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
      },
    })
  );

  const handleToggleFavorite = (id: string) => toggleFavorite.mutate({ id });

  return { handleToggleFavorite, isTogglingFavorite: toggleFavorite.isPending };
}
