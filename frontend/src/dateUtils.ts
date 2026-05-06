/**
 * Formats a date string to YYYY-MM-DD format.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "The application deadline is not specified.";
  const date = new Date(dateString);
  return date.toLocaleDateString("sv-SE");
};

/** ISO timestamp from DB when the application row was created (optional for legacy data). */
export const formatAppliedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("sv-SE");
};
