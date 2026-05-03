import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { formatDate } from "./dateUtils";
import "./JobDetails.css";
import { useParams } from "react-router-dom";
import { ActionButtons } from "./ActionButtons";

export const JobDetails = () => {
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const toggleFavorite = useMutation(trpc.toggleFavorite.mutationOptions());

  const { data: jobAd } = useQuery(trpc.getJob.queryOptions(jobId || ""));

  const { data: isFavorite } = useQuery(
    trpc.getIsFavoriteById.queryOptions(jobId || "")
  );

  const handleFavoriteClick = () =>
    toggleFavorite.mutate(
      { id: jobId || "" },
      {
        onSuccess: () =>
          queryClient.invalidateQueries(
            trpc.getIsFavoriteById.queryFilter(jobId)
          ),
      }
    );

  return (
    <div className="job-details">
      <div className="content">
        <div>
          <span
            onClick={handleFavoriteClick}
            className={isFavorite ? "favorite-icon" : "not-favorite-icon"}
          >
            {isFavorite ? "★" : "☆"}
          </span>
          <h2 className="headline">{jobAd?.headline}</h2>
        </div>
        <div className="info">
          <p className="relevant-info">Company: {jobAd?.employer?.name}</p>
          <p className="relevant-info">
            Type of contract: {jobAd?.duration?.label} -{" "}
            {jobAd?.working_hours_type?.label}
          </p>
          <p className="relevant-info">
            Last application date:{" "}
            {formatDate(jobAd?.application_deadline || "")}
          </p>
        </div>
        <p className="description">{jobAd?.description?.text}</p>
        <div className="apply-link-container">
          {jobAd?.application_details?.url && (
            <>
              <p>Apply here:</p>
              <a
                className="apply-link"
                href={jobAd?.application_details?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {jobAd?.application_details?.url}
              </a>
            </>
          )}
        </div>
      </div>
      <div className="action-container">
        <ActionButtons jobId={jobId || ""} />
      </div>
    </div>
  );
};
