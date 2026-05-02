import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";

export const Home = () => {
  const trpc = useTRPC();
  const { handleToggleFavorite } = useToggleFavorite();

  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

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
