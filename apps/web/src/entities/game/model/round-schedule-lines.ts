import type { GameRoundRow } from "@roll-and-call/database/games";

import { coordinationRangeText } from "./coordination-range-text";
import { roundRangeLabel } from "./round-range-label";
import { roundSlotLabel } from "./round-slot-label";

export type RoundScheduleRound = Pick<
  GameRoundRow,
  "roundNo" | "status" | "startAt" | "plannedEndAt" | "coordinationStart" | "coordinationEnd"
>;

export const ROUND_LINE_MARKER = {
  current: "▸",
  dated: "○",
  undecided: "·",
} as const;

export type RoundLineMarker = (typeof ROUND_LINE_MARKER)[keyof typeof ROUND_LINE_MARKER];

export type RoundScheduleLine = { key: string; marker: RoundLineMarker; text: string };

export type RoundScheduleLines = {
  finished: { label: string; detail: string } | null;
  lines: RoundScheduleLine[];
};

const FINISHED_LIST_LIMIT = 3;
const UNDECIDED_TEXT = "한 회차씩 정합니다.";

function finishedSummary(roundNos: readonly number[]) {
  const names =
    roundNos.length <= FINISHED_LIST_LIMIT
      ? roundNos.map((roundNo) => `${roundNo}회차`).join(", ")
      : roundRangeLabel([roundNos[0]!, roundNos.at(-1)!]);
  return { label: `지난 회차 ${roundNos.length}개`, detail: `${names}가 끝났습니다.` };
}

// 회차 일정 시트의 줄. 끝난 회차는 「지난 회차 n개」로 접고, 이어진 미정 회차는 한 줄로 묶는다.
export function roundScheduleLines(rounds: readonly RoundScheduleRound[]): RoundScheduleLines {
  const sorted = rounds.toSorted((a, b) => a.roundNo - b.roundNo);
  const finishedNos = sorted.filter((round) => round.status === "finished").map((r) => r.roundNo);
  const lines: RoundScheduleLine[] = [];
  let undecidedRun: number[] = [];

  function flushUndecided() {
    if (undecidedRun.length === 0) return;
    lines.push({
      key: `undecided-${undecidedRun[0]}`,
      marker: ROUND_LINE_MARKER.undecided,
      text: `${roundRangeLabel(undecidedRun)} · ${UNDECIDED_TEXT}`,
    });
    undecidedRun = [];
  }

  for (const round of sorted) {
    if (round.status === "finished") continue;
    const { roundNo, startAt, plannedEndAt, coordinationStart, coordinationEnd } = round;
    const key = `round-${roundNo}`;
    if (startAt && plannedEndAt) {
      flushUndecided();
      const marker =
        round.status === "in_progress" ? ROUND_LINE_MARKER.current : ROUND_LINE_MARKER.dated;
      lines.push({
        key,
        marker,
        text: `${roundNo}회차 · ${roundSlotLabel({ startsAt: startAt, endsAt: plannedEndAt })}`,
      });
    } else if (coordinationStart && coordinationEnd) {
      flushUndecided();
      const range = coordinationRangeText({ start: coordinationStart, end: coordinationEnd });
      lines.push({
        key,
        marker: ROUND_LINE_MARKER.undecided,
        text: `${roundNo}회차 · ${range} 중 정합니다`,
      });
    } else {
      if (undecidedRun.at(-1) !== roundNo - 1) flushUndecided();
      undecidedRun.push(roundNo);
    }
  }
  flushUndecided();

  return { finished: finishedNos.length > 0 ? finishedSummary(finishedNos) : null, lines };
}
