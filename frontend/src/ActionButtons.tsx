import { useJobActions } from "./useJobActions";
import "./ActionButtons.css";

type ActionButtonsProps = {
  jobId: string;
  headline?: string | null;
  employerName?: string | null;
};

export function ActionButtons({
  jobId,
  headline,
  employerName,
}: ActionButtonsProps) {
  const {
    status,
    handleApplyClick,
    handleInterviewingClick,
    handleAcceptOfferClick,
    handleDeclinedClick,
  } = useJobActions(jobId, headline, employerName);

  return (
    <>
      {!status && (
        <button
          className="bt-action bt-apply"
          type="button"
          onClick={handleApplyClick}
        >
          Mark as applied
        </button>
      )}
      {status === "applied" ? (
        <button
          className="bt-action bt-interviewing"
          type="button"
          onClick={handleInterviewingClick}
        >
          Interviewing
        </button>
      ) : status === "interviewing" ? (
        <button
          className="bt-action bt-accept"
          type="button"
          onClick={handleAcceptOfferClick}
        >
          Accept offer
        </button>
      ) : null}
      {(status === "applied" || status === "interviewing") && (
        <button
          className="bt-action bt-declined"
          type="button"
          onClick={handleDeclinedClick}
        >
          Declined
        </button>
      )}
    </>
  );
}
