import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";

export const JobApplications = () => {
  const trpc = useTRPC();
  const { handleToggleFavorite } = useToggleFavorite();
  const {
    data: jobApplications,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
  } = useQuery(trpc.getJobApplications.queryOptions());
  const {
    data: jobAds,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useQuery({
    ...trpc.getJobs.queryOptions(),
    enabled: Boolean(jobApplications?.length),
  });

  const applicationIds = new Set((jobApplications || []).map((job) => job.id));
  const appliedJobAds = (jobAds?.hits || []).filter((job) =>
    applicationIds.has(job.id)
  );

  if (isApplicationsLoading || isJobsLoading) {
    return <div>Loading applications...</div>;
  }

  if (isApplicationsError || isJobsError) {
    return <div>Could not load applications. Please try again.</div>;
  }

  if (applicationIds.size === 0) {
    return <div>There are no applications yet</div>;
  }

  return (
    <div>
      <h2>Applications</h2>
      <div className="jobApplications-list">
        <ul>
          {appliedJobAds.map((job) => (
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
