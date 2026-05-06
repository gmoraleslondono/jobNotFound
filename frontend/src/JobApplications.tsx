import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatAppliedAt } from "./dateUtils";
import { useTRPC } from "./trpc";
import { JobAdCard } from "./JobAdCard";
import { JOBS_QUERY_PREFIX, useToggleFavorite } from "./useToggleFavorite";
import "./JobAdCard.css";
import "./ActionButtons.css";

function storedHeadlineLabel(headline?: string | null) {
  const t = headline?.trim();
  return t ? t : "Title not saved";
}

function storedCompanyLabel(employerName?: string | null) {
  const t = employerName?.trim();
  return t ? t : "Company not saved";
}

function storedAppliedOnLabel(createdAt?: string | null) {
  if (!createdAt?.trim()) return "Not recorded";
  const formatted = formatAppliedAt(createdAt);
  return formatted || "Not recorded";
}

export const JobApplications = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { handleToggleFavorite } = useToggleFavorite();
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
  } = useQuery(trpc.getJobApplications.queryOptions());

  const applicationsList = applications ?? [];

  const removeJobApplication = useMutation(
    trpc.removeJobApplication.mutationOptions({
      onSuccess: (_data, variables) => {
        if (!variables) return;
        queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
        queryClient.invalidateQueries(
          trpc.getAppliedStatusById.queryFilter(variables.id)
        );
        queryClient.invalidateQueries(trpc.getJob.queryFilter(variables.id));
        queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_PREFIX] });
        queryClient.invalidateQueries(trpc.getJobs.queryOptions());
      },
    })
  );

  const applicationJobQueries = useQueries({
    queries: applicationsList.map((application) => ({
      ...trpc.getJob.queryOptions(application.id),
      enabled: applicationsList.length > 0,
      retry: false,
    })),
  });

  const isJobsLoading = applicationJobQueries.some((q) => q.isLoading);

  if (isApplicationsLoading || isJobsLoading) {
    return <div className="text">Loading applications...</div>;
  }

  if (isApplicationsError) {
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
          {applicationsList.map((application, index) => {
            const query = applicationJobQueries[index];
            const job = query?.data;

            if (job) {
              return (
                <JobAdCard
                  key={application.id}
                  job={job}
                  createdAt={application.createdAt}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            }

            return (
              <li key={application.id} className="job-card favorite-unavailable">
                <div className="favorite-unavailable-body">
                  <p className="card-info">
                    This job listing is no longer available. It may have been
                    removed or expired.
                  </p>
                  <p className="card-info favorite-unavailable-headline">
                    {storedHeadlineLabel(application.headline)}
                  </p>
                  <p className="card-info">
                    Company: {storedCompanyLabel(application.employerName)}
                  </p>
                  <p className="card-info">
                    Marked applied on:{" "}
                    {storedAppliedOnLabel(application.createdAt)}
                  </p>
                  <p className="card-info favorite-unavailable-id">
                    Saved job ID: {application.id}
                  </p>
                  <p className="card-info">
                    Last tracked status: {application.status}
                  </p>
                  <button
                    type="button"
                    className="bt-action bt-declined"
                    disabled={removeJobApplication.isPending}
                    onClick={() =>
                      removeJobApplication.mutate({ id: application.id })
                    }
                  >
                    Remove from applications
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
