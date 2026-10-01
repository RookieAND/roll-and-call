import { formatDateTime } from "./format-date-time";

export function formatShortDateTime(date: Date) {
  return formatDateTime(date).replace(/^\d+년 /, "");
}
