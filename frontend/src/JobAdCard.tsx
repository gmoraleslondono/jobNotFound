import { formatDate } from "./dateUtils";
import { ActionButtons } from "./ActionButtons";
import { JobAdHeader } from "./JobAdHeader";
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
      <JobAdHeader
        jobId={job.id}
        headline={job.headline}
        status={job.status}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
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
