import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { formatDate } from "./dateUtils";
import "./JobDetails.css";

const JobDetails = () => {
  const jobId = window.location.pathname.split("/").pop();
  console.log("Job ID from URL:", jobId);

  const trpc = useTRPC();
  const { data: jobAd } = useQuery(
    trpc.getJobDetails.queryOptions(jobId || ""),
  );

  console.log("Search result in JobDetails:", jobAd);

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
          onClick={() => {
            if (jobAd?.application_details?.url) {
              window.open(jobAd?.application_details?.url, "_blank");
            } else {
              console.warn("No application URL available for this job.");
            }
          }}
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
