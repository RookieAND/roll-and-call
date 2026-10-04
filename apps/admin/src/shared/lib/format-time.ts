import { formatDateTime } from "./format-date-time";

export function formatTime(date: Date) {
  return formatDateTime(date).slice(-5);
}
