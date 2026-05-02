import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import "./Home.css";
import { Link } from "react-router-dom";
import { formatDate } from "./dateUtils";
import { ActionButtons } from "./ActionButtons";

export const Home = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

  const toggleFavorite = useMutation(
    trpc.toggleFavorite.mutationOptions({
      onMutate: (variables) => {
        queryClient.setQueryData(
          trpc.getJobs.queryOptions().queryKey,
          (old: typeof searchResults) => {
            if (!old) return old;
            return {
              ...old,
              hits: old.hits.map((job) =>
                job.id === variables.id
                  ? { ...job, isFavorite: !job.isFavorite }
                  : job,
              ),
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
          {jobAds.map((job, index: number) => (
            <li className="job-card" key={index}>
              <div>
                <div className="header">
                  <span
                    onClick={() => handleToggleFavorite(job.id)}
                    className={`${job.isFavorite ? "favorite-icon" : "not-favorite-icon"} icon`}
                    aria-label="Toggle favorite"
                  >
                    <img
                      src={
                        job.isFavorite
                          ? "/icons/heart-favorite.svg"
                          : "/icons/heart.svg"
                      }
                      alt={job.isFavorite ? "Favorite" : "Not favorite"}
                      width={20}
                      height={20}
                    />
                  </span>

                  <Link to={`/job/${job.id}`} className="job-link">
                    <h2 className="job-headline job-headline-clickable">
                      {job.headline}
                    </h2>
                  </Link>
                </div>
                <div>
                  <p className="card-content">Company: {job.employer?.name}</p>
                  <p className="card-content">
                    Type of contract: {job.duration?.label} -{" "}
                    {job.working_hours_type?.label}
                  </p>
                  <p className="card-content">
                    Last application date:{" "}
                    {formatDate(job.application_deadline || "")}
                  </p>
                  <div className="labels">
                    {job.status && (
                      <span className="status-label">{job.status}</span>
                    )}
                  </div>
                </div>
              </div>
              <ActionButtons jobId={job.id || ""} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
