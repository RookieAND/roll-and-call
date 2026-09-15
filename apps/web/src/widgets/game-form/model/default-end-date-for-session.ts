import { previousDay } from "./previous-day";

export function defaultEndDateForSession(confirmedAt: string): string {
  const [date = "", time = "19:00"] = confirmedAt.split("T");
  return date ? `${previousDay(date)}T${time}` : "";
}
