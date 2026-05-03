import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";

export const Favorites = () => {
  const trpc = useTRPC();
  const { handleToggleFavorite } = useToggleFavorite();
  const {
    data: favorites,
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
  } = useQuery(trpc.getFavorites.queryOptions());

  const favoritesList = favorites ?? [];

  const favoriteJobQueries = useQueries({
    queries: favoritesList.map((favorite) => ({
      ...trpc.getJob.queryOptions(favorite.id),
      enabled: favoritesList.length > 0,
    })),
  });

  const favoriteJobAds = favoriteJobQueries
    .map((q) => q.data)
    .filter((job): job is NonNullable<typeof job> => job != null);

  const isJobsLoading = favoriteJobQueries.some((q) => q.isLoading);
  const isJobsError = favoriteJobQueries.some((q) => q.isError);

  if (isFavoritesLoading || isJobsLoading) {
    return <div className="text">Loading favorites...</div>;
  }

  if (isFavoritesError || isJobsError) {
    return (
      <div className="text">Could not load favorites. Please try again.</div>
    );
  }

  if (favoritesList.length === 0) {
    return <div className="text">There are no favorites yet.</div>;
  }

  return (
    <div className="favorites">
      <div className="favorites-list">
        <ul>
          {favoriteJobAds.map((job) => (
            <JobAdCard
              key={job.id}
              job={job}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
