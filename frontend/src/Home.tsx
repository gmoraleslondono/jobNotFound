import { useEffect, useRef, useState } from "react";
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

  const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activePopupIndex !== null &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setActivePopupIndex(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [activePopupIndex]);

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
              <div
                className="options-container"
                ref={activePopupIndex === index ? popupRef : null}
              >
                <button
                  className="options-button"
                  type="button"
                  onClick={() =>
                    setActivePopupIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                >
                  Options
                </button>
                {activePopupIndex === index && (
                  <div className="options-popup">
                    <button
                      className="bt-action"
                      type="button"
                      onClick={() => {
                        console.log("Add to favorites", index);
                        setActivePopupIndex(null);
                      }}
                    >
                      Add to favorites
                    </button>
                    <button
                      className="bt-action bt-apply"
                      type="button"
                      onClick={() => {
                        if (job?.application_details?.url) {
                          window.open(job?.application_details?.url, "_blank");
                        } else {
                          console.warn(
                            "No application URL available for this job.",
                          );
                        }
                        setActivePopupIndex(null);
                      }}
                    >
                      Apply now
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
