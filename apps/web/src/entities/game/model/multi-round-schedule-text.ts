import type { Game } from "@roll-and-call/database";

import { fromKstDateTimeInput, toKst } from "@/shared/lib";

import { coordinatingScheduleText } from "./coordinating-schedule-text";
import { datedScheduleText } from "./dated-schedule-text";
import { repeatScheduleText } from "./repeat-schedule-text";
import { ROUND_REPEAT } from "./round-repeat";
import { ROUND_SCHEDULE_KIND } from "./round-schedule-kind";
import { roundTotalLabel } from "./round-total-label";

type MultiRoundGame = Pick<
  Game,
  "roundCount" | "roundScheduleKind" | "repeatRule" | "confirmedAt" | "rangeStart" | "rangeEnd"
>;

const REPEAT_BY_INTERVAL_WEEKS = {
  1: ROUND_REPEAT.weekly,
  2: ROUND_REPEAT.biweekly,
} as const;

// 여러 번 진행 구인의 카드 일정 줄. 한 번이면 null이다.
//   지정형 반복  「매주 토 오후 12:00~4:00 · 총 6회」
//   일시가 있는 그 밖의 경우 「10월 24일 (토) 오후 12:00부터 · 총 6회」
//   1회차 범위 조율 「일정 조율 · 총 6회」, 아직 미정 「일정 미정 · 총 6회」
export function multiRoundScheduleText(game: MultiRoundGame) {
  if (game.roundCount <= 1) return null;
  const { roundCount, repeatRule, confirmedAt } = game;
  if (!confirmedAt) {
    return game.rangeStart && game.rangeEnd
      ? coordinatingScheduleText(roundCount)
      : `일정 미정 · ${roundTotalLabel(roundCount)}`;
  }
  const repeat =
    repeatRule && game.roundScheduleKind === ROUND_SCHEDULE_KIND.designated
      ? REPEAT_BY_INTERVAL_WEEKS[repeatRule.intervalWeeks as 1 | 2]
      : undefined;
  if (repeatRule && repeat) {
    const date = toKst(confirmedAt).format("YYYY-MM-DD");
    return repeatScheduleText({
      repeat,
      startsAt: fromKstDateTimeInput(`${date}T${repeatRule.startTime}`),
      endsAt: fromKstDateTimeInput(`${date}T${repeatRule.endTime}`),
      roundCount,
    });
  }
  return datedScheduleText({ startsAt: confirmedAt, roundCount });
}
