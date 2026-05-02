import { useQuery } from "@tanstack/react-query";
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
  const {
    data: jobAds,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useQuery({
    ...trpc.getJobs.queryOptions(),
    enabled: Boolean(favorites?.length),
  });

  const favoritesList = favorites || [];

  const favoriteJobAds = jobAds?.hits.filter((job) =>
    favoritesList.some((favorite) => favorite.id === job.id),
  );

  if (isFavoritesLoading || isJobsLoading) {
    return <div>Loading favorites...</div>;
  }

  if (isFavoritesError || isJobsError) {
    return <div>Could not load favorites. Please try again.</div>;
  }

  if (favoritesList.length === 0) {
    return <div>There are no favorites yet</div>;
  }

  return (
    <div>
      <h2>Favorites</h2>
      <div className="favorites-list">
        <ul>
          {(favoriteJobAds || []).map((job) => (
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
