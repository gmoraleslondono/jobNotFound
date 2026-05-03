import { Link } from "react-router-dom";
import { formatDate } from "./dateUtils";
import { ActionButtons } from "./ActionButtons";
import "./JobAdCard.css";

type JobAdCardProps = {
  job: {
    id: string;
    isFavorite?: boolean;
    headline?: string;
    employer?: { name?: string };
    duration?: { label?: string };
    working_hours_type?: { label?: string };
    application_deadline?: string | null;
    status?: string | null;
  };
  onToggleFavorite: (id: string) => void;
};

export const JobAdCard = ({ job, onToggleFavorite }: JobAdCardProps) => {
  const isFavorite = Boolean(job.isFavorite);

  return (
    <li className="job-card">
      <div className="card-header">
        <span
          onClick={() => onToggleFavorite(job.id)}
          className={`${isFavorite ? "favorite-icon" : "not-favorite-icon"} icon`}
          aria-label="Toggle favorite"
        >
          <img
            src={isFavorite ? "/icons/heart-favorite.svg" : "/icons/heart.svg"}
            alt={isFavorite ? "Favorite" : "Not favorite"}
            width={20}
            height={20}
          />
        </span>

        <Link to={`/job/${job.id}`} className="job-link">
          <h2 className="job-headline job-headline-clickable">
            {job.headline}
          </h2>
        </Link>
        <div className="labels">
          {job.status && <span className="status-label">{job.status}</span>}
        </div>
      </div>
      <div className="card-content">
        <div className="card-information">
          <p className="card-info">Company: {job.employer?.name}</p>
          <p className="card-info">
            Type of contract: {job.duration?.label} -{" "}
            {job.working_hours_type?.label}
          </p>
          <p className="card-info">
            Last application date: {formatDate(job.application_deadline || "")}
          </p>
        </div>
        <div className="card-actions">
          <ActionButtons jobId={job.id || ""} />
        </div>
      </div>
    </li>
  );
};
