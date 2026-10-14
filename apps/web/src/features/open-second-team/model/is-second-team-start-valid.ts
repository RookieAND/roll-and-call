import { toKstDateInput } from "@/shared/lib";

export function isSecondTeamStartValid({
  baseDate,
  startsAt,
}: {
  baseDate: string;
  startsAt: Date;
}): boolean {
  return toKstDateInput(startsAt) >= baseDate;
}
