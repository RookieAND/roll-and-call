import { formatDate } from "@/shared/lib";

import { roundTotalLabel } from "./round-total-label";
import type { ScheduleLine } from "./schedule-line";

export function pastScheduleLine({
  line,
  endsAt,
  endDate,
  roundCount = 1,
}: {
  line: ScheduleLine;
  endsAt: Date | null;
  endDate: Date;
  roundCount?: number;
}): ScheduleLine {
  const suffix = roundCount > 1 ? ` · ${roundTotalLabel(roundCount)}` : "";
  if (endsAt) return { ...line, text: `${formatDate(endsAt)} 세션 종료${suffix}`, finished: true };
  return { ...line, text: `${formatDate(endDate)}에 모집 마감${suffix}`, finished: true };
}
