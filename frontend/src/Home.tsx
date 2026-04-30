import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import "./Home.css";
import { Link } from "react-router-dom";
import { formatDate } from "./dateUtils";

export const Home = () => {
  const trpc = useTRPC();
  const { data: searchResults, isLoading } = useQuery(
    trpc.getJobs.queryOptions(),
  );

  const jobAds = searchResults?.hits || [];

  return (
    <div className="home app-content">
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobAds.map((job, index: number) => (
            <li className="job-card" key={index}>
              <div>
                <Link to={`/job/${job.id}`} className="job-link">
                  <h2 className="job-headline job-headline-clickable">
                    {job.headline}
                  </h2>
                </Link>
                <div>
                  <p className="card-content">Company: {job.employer?.name}</p>
                  <p className="card-content">
                    Type of contract: {job.duration?.label} -{" "}
                    {job.working_hours_type?.label}
                  </p>
                  <p className="card-content">
                    Last application date:{" "}
                    {formatDate(job.application_deadline || "")}
                  </p>
                </div>
              </div>
              {/* <div className="options-container"></div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
