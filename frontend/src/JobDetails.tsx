import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { formatDate } from "./dateUtils";
import "./JobDetails.css";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { jobId } = useParams();

  const trpc = useTRPC();

  const { data: jobAd } = useQuery(trpc.getJob.queryOptions(jobId || ""));
  const addJobToApplied = useMutation(trpc.applyToJob.mutationOptions());

  const handleApplyNowClick = () => {
    addJobToApplied.mutate({ id: jobId || "", status: "applied" });
  };

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
        <button
          className="bt-action bt-apply"
          type="button"
          onClick={() => handleApplyNowClick()}
        >
          Applied
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
