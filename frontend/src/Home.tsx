import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";
import { trpcClient } from "./trpc";
import "./Home.css";

const ROLE_FILTERS = [
  { id: "all", label: "All roles" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Fullstack" },
] as const;

type RoleFilterId = (typeof ROLE_FILTERS)[number]["id"];

export const Home = () => {
  const { handleToggleFavorite } = useToggleFavorite();
  const [filterId, setFilterId] = useState<RoleFilterId>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", filterId],
    queryFn: () =>
      trpcClient.getJobs.query(
        filterId === "all" ? undefined : { q: filterId }
      ),
  });

  const jobAds = data?.hits ?? [];

  const totalMatches = data?.total.value ?? 0;
  const activeFilterLabel =
    ROLE_FILTERS.find((f) => f.id === filterId)?.label ?? filterId;

  return (
    <div className="home">
      <div className="job-filter-bar" role="group" aria-label="Job role filter">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={
              f.id === filterId
                ? "job-filter-button job-filter-button--active"
                : "job-filter-button"
            }
            aria-pressed={f.id === filterId}
            onClick={() => setFilterId(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p className="text">Loading jobs...</p>
      ) : isError ? (
        <p className="text">Could not load jobs. Please try again.</p>
      ) : (
        <>
          <div>
            <p>
              Showing <b>{jobAds.length}</b>
              {totalMatches > jobAds.length ? (
                <>
                  {" "}
                  of <b>{totalMatches}</b>
                </>
              ) : null}{" "}
              developer-related jobs in Stockholm
              {filterId !== "all" ? (
                <>
                  {" "}
                  for <b>{activeFilterLabel}</b>
                </>
              ) : null}
              <span>.</span>
            </p>
          </div>
          <ul>
            {jobAds.map((job) => (
              <JobAdCard
                key={job.id}
                job={job}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
