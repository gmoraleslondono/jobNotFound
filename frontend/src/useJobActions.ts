import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HOME_INFINITE_JOBS_QUERY_KEY } from "./useToggleFavorite";
import { useTRPC } from "./trpc";

export function useJobActions(jobId: string) {
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
    queryClient.invalidateQueries({ queryKey: [...HOME_INFINITE_JOBS_QUERY_KEY] });
    queryClient.invalidateQueries(trpc.getJobApplications.queryOptions());
  };

  const handleApplyClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "applied" },
      { onSuccess: invalidateStatus }
    );

  const handleInterviewingClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "interviewing" },
      { onSuccess: invalidateStatus }
    );

  const handleAcceptOfferClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "hired" },
      { onSuccess: invalidateStatus }
    );

  const handleDeclinedClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "declined" },
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
