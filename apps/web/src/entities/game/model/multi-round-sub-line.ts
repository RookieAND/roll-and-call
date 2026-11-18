import { formatDateWeekday } from "@/shared/lib";

import { coordinationRangeText } from "./coordination-range-text";
import type { MultiRoundGame } from "./multi-round-game";
import { ROUND_SCHEDULE_KIND } from "./round-schedule-kind";

// 상세 정보 표의 일정 줄 아래 보조 줄. 한 번이면 null이다.
//   지정형 「첫 회 10월 24일 (토)」
//   조율형 「다음 회차는 한 회차씩 정합니다.」
//   조율형, 1회차 범위 조율 중 「1회차는 10월 24일 ~ 11월 6일 중 정합니다.」
export function multiRoundSubLine(game: MultiRoundGame) {
  if (game.roundCount <= 1) return null;
  const { confirmedAt, rangeStart, rangeEnd } = game;
  if (game.roundScheduleKind === ROUND_SCHEDULE_KIND.designated) {
    return confirmedAt ? `첫 회 ${formatDateWeekday(confirmedAt)}` : null;
  }
  if (!confirmedAt && rangeStart && rangeEnd) {
    return `1회차는 ${coordinationRangeText({ start: rangeStart, end: rangeEnd })} 중 정합니다.`;
  }
  return "다음 회차는 한 회차씩 정합니다.";
}
