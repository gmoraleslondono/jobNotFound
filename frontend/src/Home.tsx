import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";

export const Home = () => {
  const trpc = useTRPC();
  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

  console.log({ searchResults });

  const jobAds = searchResults?.hits || [];

  return (
    <div>
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <div>
          {jobAds.map((job, index: number) => (
            <div key={index}>
              <h2>{job.headline}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
