import { useInfiniteQuery } from "@tanstack/react-query";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";
import { trpcClient } from "./trpc";
import "./Home.css";

const PAGE_SIZE = 20;

export const Home = () => {
  const { handleToggleFavorite } = useToggleFavorite();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs", "infinite"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      return trpcClient.getJobs.query({
        offset: pageParam,
        limit: PAGE_SIZE,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const fetchedCount = allPages.reduce(
        (count, page) => count + page.hits.length,
        0
      );
      return fetchedCount < lastPage.total.value ? fetchedCount : undefined;
    },
  });

  const jobAds = data?.pages.flatMap((page) => page.hits) || [];

  return (
    <div className="home">
      {isLoading ? (
        <p className="text">Loading jobs...</p>
      ) : isError ? (
        <p className="text">Could not load jobs. Please try again.</p>
      ) : (
        <>
          <ul>
            {jobAds.map((job) => (
              <JobAdCard
                key={job.id}
                job={job}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </ul>
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="load-more-button"
            >
              {isFetchingNextPage ? "Loading more..." : "Load more jobs"}
            </button>
          )}
        </>
      )}
    </div>
  );
};
