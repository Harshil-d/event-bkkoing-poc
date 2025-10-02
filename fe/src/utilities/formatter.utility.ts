/**
 * Formats a contact number into the format (XXX) XXX-XXXX.
 * @param {string} phoneNumber - The raw phone number as a string.
 * @returns {string} - The formatted phone number.
 */
export const formatContactNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the cleaned number starts with country code and handle formatting
  if (cleaned.length === 12) {
    // For Indian numbers
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 11) {
    // For Indian numbers
    return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 10) {
    // Local numbers (without country code)
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phoneNumber; // Return the original if it's not a valid 10-digit number
};

export const toTitleCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
