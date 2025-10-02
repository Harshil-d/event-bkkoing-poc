import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const isValidPhoneNumber = (phone: string): boolean => {
  debugger;
  const phoneNumber = parsePhoneNumberFromString(phone);

  if (phoneNumber && phoneNumber.isValid()) {
    return true;
  } else {
    return false;
  }
};
