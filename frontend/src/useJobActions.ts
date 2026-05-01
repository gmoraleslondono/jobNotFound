import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "./trpc";

export function useJobActions(jobId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: appliedStatus } = useQuery(
    trpc.getAppliedStatusById.queryOptions(jobId),
  );
  const { data: isFavorite } = useQuery(
    trpc.getIsFavoriteById.queryOptions(jobId),
  );
  const addJobToApplied = useMutation(trpc.applyToJob.mutationOptions());
  const toggleFavorite = useMutation(trpc.toggleFavorite.mutationOptions());

  const invalidateStatus = () =>
    queryClient.invalidateQueries(trpc.getAppliedStatusById.queryFilter(jobId));

  const handleApplyClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "applied" },
      { onSuccess: invalidateStatus },
    );

  const handleInterviewingClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "interviewing" },
      { onSuccess: invalidateStatus },
    );

  const handleAcceptOfferClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "hired" },
      { onSuccess: invalidateStatus },
    );

  const handleDeclinedClick = () =>
    addJobToApplied.mutate(
      { id: jobId, status: "declined" },
      { onSuccess: invalidateStatus },
    );

  const handleFavoriteClick = () =>
    toggleFavorite.mutate(
      { id: jobId },
      {
        onSuccess: () =>
          queryClient.invalidateQueries(
            trpc.getIsFavoriteById.queryFilter(jobId),
          ),
      },
    );

  return {
    status: appliedStatus?.status,
    isFavorite: isFavorite ?? false,
    handleApplyClick,
    handleInterviewingClick,
    handleAcceptOfferClick,
    handleDeclinedClick,
    handleFavoriteClick,
  };
}
