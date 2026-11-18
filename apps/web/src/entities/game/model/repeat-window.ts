import { fromKstDateTimeInput, toKst } from "@/shared/lib";

import type { MultiRoundGame } from "./multi-round-game";
import { ROUND_REPEAT, type RoundRepeatWord } from "./round-repeat";
import { ROUND_SCHEDULE_KIND } from "./round-schedule-kind";

const REPEAT_BY_INTERVAL_WEEKS = {
  1: ROUND_REPEAT.weekly,
  2: ROUND_REPEAT.biweekly,
} as const;

// 지정형 매주·격주 반복이면 1회차의 반복 단어와 시작·끝 시각. 그 밖에는 null이다.
export function repeatWindow(
  game: Pick<MultiRoundGame, "roundScheduleKind" | "repeatRule" | "confirmedAt">,
): { repeat: RoundRepeatWord; startsAt: Date; endsAt: Date } | null {
  const { repeatRule, confirmedAt } = game;
  if (!confirmedAt || !repeatRule || game.roundScheduleKind !== ROUND_SCHEDULE_KIND.designated) {
    return null;
  }
  const repeat = REPEAT_BY_INTERVAL_WEEKS[repeatRule.intervalWeeks as 1 | 2];
  if (!repeat) return null;
  const date = toKst(confirmedAt).format("YYYY-MM-DD");
  return {
    repeat,
    startsAt: fromKstDateTimeInput(`${date}T${repeatRule.startTime}`),
    endsAt: fromKstDateTimeInput(`${date}T${repeatRule.endTime}`),
  };
}
