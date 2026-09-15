import { addDays } from "@/shared/lib";

export function defaultEndDateForSession(confirmedAt: string): string {
  const [date = "", time = "19:00"] = confirmedAt.split("T");
  return date ? `${addDays(date, -1)}T${time}` : "";
}
