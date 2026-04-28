import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import "./Home.css";

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
                      className="popup-action"
                      type="button"
                      onClick={() => {
                        console.log("Add to favorites", index);
                        setActivePopupIndex(null);
                      }}
                    >
                      Add to favorites
                    </button>
                    <button
                      className="popup-action popup-apply"
                      type="button"
                      onClick={() => {
                        console.log("Apply now", index);
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
