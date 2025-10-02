import { format, parseISO } from 'date-fns';

/**
 * Formats a date string in the format "YYYY-MM-DD" to "DD MMM, YYYY".
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {string} - The formatted date in "DD MMM, YYYY" format.
 */
export const formatDate = (dateString: string): string => {
  // Parse the date string into a Date object
  const date = parseISO(dateString);

  // Format the date to "DD MMM, YYYY"
  return format(date, 'dd MMM, yyyy');
};

export const formatToHHMM = (time: string): string => {
  // Remove any non-digit characters (except colon)
  let cleaned = time.replace(/[^0-9:]/g, '');

  // Handle cases without colons
  if (!cleaned.includes(':')) {
    if (cleaned.length === 3) {
      // If it's 3 digits (e.g., HMM), split as H:MM
      cleaned = `${cleaned[0]}:${cleaned.slice(1)}`;
    } else if (cleaned.length === 4) {
      // If it's 4 digits (e.g., HHMM), split as HH:MM
      cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    } else if (cleaned.length === 2) {
      // If it's 2 digits (e.g., HM), split as H:M
      cleaned = `${cleaned[0]}:${cleaned[1]}0`;
    } else {
      // If it's not a valid length (not 2, 3, or 4 digits), return original input
      return time;
    }
  }

  // Split into hours and minutes, handle missing or incomplete parts
  const parts = cleaned.split(':');
  if (parts.length !== 2 || parts[0].length > 2 || parts[1].length > 2) {
    return time; // Invalid time format, return original input
  }

  const [hours, minutes] = parts;

  // Ensure hours and minutes are valid
  const hh = hours.length === 1 ? `0${hours}` : hours; // Ensure 2 digits for hours
  const mm = minutes.length === 1 ? `${minutes}0` : minutes; // Ensure 2 digits for minutes

  // Check if hours and minutes are valid numbers
  if (isNaN(parseInt(hh)) || isNaN(parseInt(mm))) {
    return time; // Return original input if values are not valid numbers
  }

  // Return formatted time in HH:MM
  return `${hh}:${mm}`;
};
