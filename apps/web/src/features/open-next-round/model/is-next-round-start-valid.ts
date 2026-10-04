import { toKstDateInput } from "@/shared/lib";

export function isNextRoundStartValid({
  baseDate,
  startsAt,
}: {
  baseDate: string;
  startsAt: Date;
}): boolean {
  return toKstDateInput(startsAt) >= baseDate;
}
