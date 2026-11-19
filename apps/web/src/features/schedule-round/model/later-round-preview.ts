import { formatDateWeekday, toKst } from "@/shared/lib";

export const LATER_PREVIEW_LIMIT = 4;

export interface LaterRound {
  roundNo: number;
  startsAt: string;
}

// 이후 회차를 현재 회차와 같은 간격만큼 옮겼을 때의 줄. 날짜만 보여 준다.
export function laterRoundPreview({
  rounds,
  shiftMs,
}: {
  rounds: readonly LaterRound[];
  shiftMs: number;
}) {
  const rows = rounds.map(({ roundNo, startsAt }) => {
    const moved = new Date(new Date(startsAt).getTime() + shiftMs);
    return {
      line: `${roundNo}회차 · ${formatDateWeekday(startsAt)} → ${formatDateWeekday(moved)}`,
      weekdayChanged: toKst(startsAt).day() !== toKst(moved).day(),
    };
  });
  return {
    lines: rows.slice(0, LATER_PREVIEW_LIMIT).map((row) => row.line),
    moreCount: Math.max(0, rows.length - LATER_PREVIEW_LIMIT),
    weekdayChanged: rows.some((row) => row.weekdayChanged),
  };
}
