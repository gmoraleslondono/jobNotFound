import { Link } from "react-router-dom";
import "./JobAdHeader.css";

export type JobAdHeaderProps = {
  jobId: string;
  headline?: string;
  status?: string | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export const JobAdHeader = ({
  jobId,
  headline,
  status,
  isFavorite,
  onToggleFavorite,
}: JobAdHeaderProps) => {
  return (
    <div className="job-ad-header">
      <span
        onClick={() => onToggleFavorite(jobId)}
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

      <Link to={`/job/${jobId}`} className="job-link">
        <h2 className="job-headline job-headline-clickable">{headline}</h2>
      </Link>
      <div className="labels">
        {status && <span className="status-label">{status}</span>}
      </div>
    </div>
  );
};
