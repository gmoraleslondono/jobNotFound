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
