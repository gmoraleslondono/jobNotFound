import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import "./Home.css";

export const Home = () => {
  const trpc = useTRPC();
  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

  const jobAds = searchResults?.hits || [];

  const jobPublishedDate = (job: string) => {
    const date = new Date(job);
    return date.toISOString().split("T")[0];
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobAds.map((job, index: number) => (
            <li className="job-card" key={index}>
              <div>
                <h2 className="job-headline">{job.headline}</h2>
                <div>
                  <p className="card-content">Company: {job.employer.name}</p>
                  <p className="card-content">
                    Type of contract: {job.duration.label} -{" "}
                    {job.working_hours_type?.label}
                  </p>
                  <p className="card-content">
                    Last application date:{" "}
                    {jobPublishedDate(job.application_deadline)}
                  </p>
                </div>
              </div>
              <div className="options-container">
                <button className="options-button">Options</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
