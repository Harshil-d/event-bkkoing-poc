export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const timeDifferenceInMilliSecondsFromCurrentTime = (
  date: Date | string | number
): number => {
  const dateCompare = date instanceof Date ? date : new Date(date);
  return dateCompare.getTime() - new Date().getTime();
};
