import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";
import "./JobAdCard.css";
import "./ActionButtons.css";

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
      retry: false,
    })),
  });

  const isJobsLoading = favoriteJobQueries.some((q) => q.isLoading);

  if (isFavoritesLoading || isJobsLoading) {
    return <div className="text">Loading favorites...</div>;
  }

  if (isFavoritesError) {
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
          {favoritesList.map((favorite, index) => {
            const query = favoriteJobQueries[index];
            const job = query?.data;

            if (job) {
              return (
                <JobAdCard
                  key={favorite.id}
                  job={job}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            }

            return (
              <li key={favorite.id} className="job-card favorite-unavailable">
                <div className="favorite-unavailable-body">
                  <p className="card-info">
                    This job listing is no longer available. It may have been
                    removed or expired.
                  </p>
                  <p className="card-info favorite-unavailable-id">
                    Saved job ID: {favorite.id}
                  </p>
                  <button
                    type="button"
                    className="bt-action bt-declined"
                    onClick={() =>
                      handleToggleFavorite({
                        id: favorite.id,
                        isFavorite: true,
                      })
                    }
                  >
                    Remove from favorites
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
