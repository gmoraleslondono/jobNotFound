import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { useToggleFavorite } from "./useToggleFavorite";

export const JobApplications = () => {
  const trpc = useTRPC();
  const { handleToggleFavorite } = useToggleFavorite();
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
  } = useQuery(trpc.getJobApplications.queryOptions());

  const applicationsList = applications ?? [];

  const applicationJobQueries = useQueries({
    queries: applicationsList.map((application) => ({
      ...trpc.getJob.queryOptions(application.id),
      enabled: applicationsList.length > 0,
    })),
  });

  const appliedJobAds = applicationJobQueries
    .map((q) => q.data)
    .filter((job): job is NonNullable<typeof job> => job != null);

  const isJobsLoading = applicationJobQueries.some((q) => q.isLoading);
  const isJobsError = applicationJobQueries.some((q) => q.isError);

  if (isApplicationsLoading || isJobsLoading) {
    return <div className="text">Loading applications...</div>;
  }

  if (isApplicationsError || isJobsError) {
    return (
      <div className="text">Could not load applications. Please try again.</div>
    );
  }

  if (applicationsList.length === 0) {
    return <div className="text">There are no applications yet.</div>;
  }

  return (
    <div className="job-applications">
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
