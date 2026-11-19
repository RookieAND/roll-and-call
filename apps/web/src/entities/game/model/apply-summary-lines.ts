import { formatDate, formatDateWeekday } from "@/shared/lib";

import { coordinationRangeText } from "./coordination-range-text";
import type { MultiRoundGame } from "./multi-round-game";
import { roundClockLabel } from "./round-clock-label";
import { ROUND_SCHEDULE_KIND } from "./round-schedule-kind";
import { roundSummaryLine } from "./round-summary-line";

const LAST_ROUND_LINE = "마지막 회차까지 함께해 주세요.";

// 다회차 신청 시트의 요약 카드 줄. 첫 줄이 제목 줄이다.
//   지정형 「10월 24일부터 시작합니다.」
//   조율형 「1회차는 10월 24일 (토) 오후 12:00입니다.」 또는 「1회차는 10월 24일 ~ 11월 6일 중 정합니다.」
export function applySummaryLines(game: MultiRoundGame) {
  const { confirmedAt, rangeStart, rangeEnd } = game;
  const isDesignated = game.roundScheduleKind === ROUND_SCHEDULE_KIND.designated;
  let startLine: string | null = null;
  if (isDesignated && confirmedAt) {
    startLine = `${formatDate(confirmedAt)}부터 시작합니다.`;
  } else if (!isDesignated && confirmedAt) {
    startLine = `1회차는 ${formatDateWeekday(confirmedAt)} ${roundClockLabel(confirmedAt)}입니다.`;
  } else if (!isDesignated && rangeStart && rangeEnd) {
    startLine = `1회차는 ${coordinationRangeText({ start: rangeStart, end: rangeEnd })} 중 정합니다.`;
  }
  return [roundSummaryLine(game), ...(startLine ? [startLine] : []), LAST_ROUND_LINE];
}
