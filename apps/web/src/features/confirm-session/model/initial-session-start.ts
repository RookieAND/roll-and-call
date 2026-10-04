import type { CoordinationWindow } from "@/entities/game";
import type { TimeRow } from "@/shared/lib";

import { DAY_MINUTES, toSessionStart, type SessionStart } from "./session-start";

const DEFAULT_HOUR = 19;

// 이미 정한 시각 → 1순위 후보 → 조율 첫날 19:00(시간대에 있으면) → 조율 첫날 시간대 첫 줄.
export function initialSessionStart({
  seedIso,
  rangeStart,
  window,
  timeRows,
}: {
  seedIso: string | null;
  rangeStart: string;
  window: CoordinationWindow;
  timeRows: TimeRow[];
}): SessionStart {
  if (seedIso) return toSessionStart({ iso: seedIso, window });
  const row =
    timeRows.find((candidate) => candidate.dayOffset === 0 && candidate.hour === DEFAULT_HOUR) ??
    timeRows[0];
  const minutes = row ? row.dayOffset * DAY_MINUTES + row.hour * 60 + row.minute : 0;
  return { date: rangeStart, minutes };
}
