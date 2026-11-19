import { formatDateWeekday, toKst } from "@/shared/lib";

import { coordinationRangeText } from "./coordination-range-text";
import type { MultiRoundGame } from "./multi-round-game";
import { repeatWindow } from "./repeat-window";
import { roundClockLabel } from "./round-clock-label";
import { ROUND_REPEAT_WORD } from "./round-repeat";
import { roundTimeRange } from "./round-time-range";
import { roundTotalLabel } from "./round-total-label";

// 상세 정보 표의 「첫 회」·「진행」 줄. 한 번이면 null이다.
//   지정형 반복  첫 회 「10월 24일 (토) 오후 12:00~4:00」 · 진행 「매주 토 · 총 6회」
//   조율형       첫 회 「10월 24일 (토) 오후 12:00부터」 또는 「10월 24일 ~ 11월 6일 중 조율」 · 진행 「회차마다 정하며 총 6회」
export function multiRoundDetailRows(game: MultiRoundGame) {
  if (game.roundCount <= 1) return null;
  const { roundCount, confirmedAt, rangeStart, rangeEnd } = game;
  const repeat = repeatWindow(game);
  const pace = repeat
    ? `${ROUND_REPEAT_WORD[repeat.repeat]} ${toKst(repeat.startsAt).format("dd")} · ${roundTotalLabel(roundCount)}`
    : `회차마다 정하며 ${roundTotalLabel(roundCount)}`;
  if (confirmedAt) {
    const when = repeat ? roundTimeRange(repeat) : `${roundClockLabel(confirmedAt)}부터`;
    return { first: `${formatDateWeekday(confirmedAt)} ${when}`, pace };
  }
  const first =
    rangeStart && rangeEnd
      ? `${coordinationRangeText({ start: rangeStart, end: rangeEnd })} 중 조율`
      : "일정 미정";
  return { first, pace };
}
