import { useJobActions } from "./useJobActions";

export function ActionButtons({ jobId }: { jobId: string }) {
  const {
    status,
    isFavorite,
    handleFavoriteClick,
    handleApplyClick,
    handleInterviewingClick,
    handleAcceptOfferClick,
    handleDeclinedClick,
  } = useJobActions(jobId);

  return (
    <div className="actions">
      <button
        className="bt-action bt-favorite"
        type="button"
        onClick={handleFavoriteClick}
      >
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
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
          className="bt-action bt-apply"
          type="button"
          onClick={handleInterviewingClick}
        >
          Interviewing
        </button>
      ) : status === "interviewing" ? (
        <button
          className="bt-action bt-apply"
          type="button"
          onClick={handleAcceptOfferClick}
        >
          Accept offer
        </button>
      ) : null}
      {(status === "applied" || status === "interviewing") && (
        <button
          className="bt-action bt-apply"
          type="button"
          onClick={handleDeclinedClick}
        >
          Declined
        </button>
      )}
    </div>
  );
}
