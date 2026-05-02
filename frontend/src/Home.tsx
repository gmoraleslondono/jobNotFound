import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../backend/appRouter";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;
type ToggleFavoriteInput = RouterInputs["toggleFavorite"];
type JobsResponse = RouterOutputs["getJobs"];

export const Home = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

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
              hits: old.hits.map((job) => {
                const currentJob = job as Exclude<typeof job, void>;
                return currentJob.id === variables.id
                  ? { ...currentJob, isFavorite: !currentJob.isFavorite }
                  : currentJob;
              }),
            };
          },
        );
      },
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.getJobs.queryOptions()),
    }),
  );

  const handleToggleFavorite = (id: string) => toggleFavorite.mutate({ id });

  const jobAds = searchResults?.hits || [];

  return (
    <div className="home app-content">
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobAds.map((job) => (
            <JobAdCard
              key={job.id}
              job={job}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
