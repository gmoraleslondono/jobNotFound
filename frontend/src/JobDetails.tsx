import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { formatDate } from "./dateUtils";
import "./JobDetails.css";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { jobId } = useParams();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: jobAd } = useQuery(trpc.getJob.queryOptions(jobId || ""));
  const addJobToApplied = useMutation(trpc.applyToJob.mutationOptions());
  const { data: appliedStatus } = useQuery(
    trpc.getAppliedStatusById.queryOptions(jobId || ""),
  );

  const handleApplyClick = () => {
    addJobToApplied.mutate(
      { id: jobId || "", status: "applied" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.getAppliedStatusById.queryFilter(jobId || ""),
          );
        },
      },
    );
    console.log("applied", jobId);
  };

  const handleInterviewingClick = () => {
    addJobToApplied.mutate(
      { id: jobId || "", status: "interviewing" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.getAppliedStatusById.queryFilter(jobId || ""),
          );
        },
      },
    );
  };

  const handleAcceptOfferClick = () => {
    addJobToApplied.mutate(
      { id: jobId || "", status: "hired" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.getAppliedStatusById.queryFilter(jobId || ""),
          );
        },
      },
    );
  };

  const handleDeclinedClick = () => {
    addJobToApplied.mutate(
      { id: jobId || "", status: "declined" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.getAppliedStatusById.queryFilter(jobId || ""),
          );
        },
      },
    );
  };

  const status = appliedStatus?.status;

  return (
    <div className="job-details app-content">
      <h1>Job Details</h1>
      <div className="content">
        <h2 className="headline">{jobAd?.headline}</h2>
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
        {jobAd?.application_details?.url && (
          <a
            href={jobAd?.application_details?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply here: {jobAd?.application_details?.url}
          </a>
        )}
      </div>
      <div className="actions">
        <button
          className="bt-action bt-favorite"
          type="button"
          onClick={() => {
            console.log("Add to favorites", jobId);
          }}
        >
          Add to favorites
        </button>
        {!status && (
          <button
            className="bt-action bt-apply"
            type="button"
            onClick={() => handleApplyClick()}
          >
            Mark as applied
          </button>
        )}
        {status === "applied" ? (
          <button
            className="bt-action bt-apply"
            type="button"
            onClick={() => handleInterviewingClick()}
          >
            Interviewing
          </button>
        ) : status === "interviewing" ? (
          <button
            className="bt-action bt-apply"
            type="button"
            onClick={() => handleAcceptOfferClick()}
          >
            Accept offer
          </button>
        ) : null}
        {(status === "applied" || status === "interviewing") && (
          <button
            className="bt-action bt-apply"
            type="button"
            onClick={() => handleDeclinedClick()}
          >
            Declined
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
