import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JOBS_QUERY_PREFIX } from "./useToggleFavorite";
import { useTRPC } from "./trpc";

export function useJobActions(
  jobId: string,
  headline?: string | null,
  employerName?: string | null
) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: appliedStatus } = useQuery(
    trpc.getAppliedStatusById.queryOptions(jobId)
  );
  const addJobToApplied = useMutation(trpc.applyToJob.mutationOptions());

  const invalidateStatus = () => {
    queryClient.invalidateQueries(trpc.getAppliedStatusById.queryFilter(jobId));
    queryClient.invalidateQueries(trpc.getJob.queryFilter(jobId));
    queryClient.invalidateQueries(trpc.getJobs.queryOptions());
    queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_PREFIX] });
    queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
  };

  const handleApplyClick = () =>
    addJobToApplied.mutate(
      {
        id: jobId,
        status: "applied",
        headline: headline ?? undefined,
        employerName: employerName ?? undefined,
      },
      { onSuccess: invalidateStatus }
    );

  const handleInterviewingClick = () =>
    addJobToApplied.mutate(
      {
        id: jobId,
        status: "interviewing",
        headline: headline ?? undefined,
        employerName: employerName ?? undefined,
      },
      { onSuccess: invalidateStatus }
    );

  const handleAcceptOfferClick = () =>
    addJobToApplied.mutate(
      {
        id: jobId,
        status: "hired",
        headline: headline ?? undefined,
        employerName: employerName ?? undefined,
      },
      { onSuccess: invalidateStatus }
    );

  const handleDeclinedClick = () =>
    addJobToApplied.mutate(
      {
        id: jobId,
        status: "declined",
        headline: headline ?? undefined,
        employerName: employerName ?? undefined,
      },
      { onSuccess: invalidateStatus }
    );

  return {
    status: appliedStatus?.status,
    handleApplyClick,
    handleInterviewingClick,
    handleAcceptOfferClick,
    handleDeclinedClick,
  };
}
