// Get today's date in YYYY-MM-DD format
export const getTodayString = () => {
  const options = {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const date = new Intl.DateTimeFormat("en-GB", options).format(new Date());
  return date.split("/").reverse().join("-"); // Format as YYYY-MM-DD
};
