import { format, parse, isValid, addMonths } from "date-fns";

// Format date for display
export const formatDisplayDate = (dateString: string) => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return isValid(date) ? format(date, "MMMM d, yyyy") : "Invalid date";
};

// Format date for input fields
export const formatInputDate = (dateString: string) => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return isValid(date) ? format(date, "yyyy-MM-dd") : "";
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return format(new Date(), "yyyy-MM-dd");
};

// Check if a date is in the past
export const isPastDate = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return date < today;
};

// Get date range for calendar display
export const getDateRange = () => {
  const today = new Date();
  const startDate = today;
  const endDate = addMonths(today, 2);
  return { startDate, endDate };
};

// Parse time string to a Date object
export const parseTimeString = (timeStr: string, dateStr: string) => {
  const dateTimeStr = `${dateStr} ${timeStr}`;
  return parse(dateTimeStr, "yyyy-MM-dd h:mm a", new Date());
};

// Format 24h time to 12h time
export const format24hTo12h = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Format 12h time to 24h time
export const format12hTo24h = (time12h: string) => {
  const [timePart, period] = time12h.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
