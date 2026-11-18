import { toKst } from "@/shared/lib";

import { ROUND_REPEAT_WORD, type RoundRepeatWord } from "./round-repeat";
import { roundTimeRange } from "./round-time-range";
import { roundTotalLabel } from "./round-total-label";

// 「매주 토 오후 12:00~4:00 · 총 6회」
export function repeatScheduleText({
  repeat,
  startsAt,
  endsAt,
  roundCount,
}: {
  repeat: RoundRepeatWord;
  startsAt: Date;
  endsAt: Date;
  roundCount: number;
}) {
  const weekday = toKst(startsAt).format("dd");
  return `${ROUND_REPEAT_WORD[repeat]} ${weekday} ${roundTimeRange({ startsAt, endsAt })} · ${roundTotalLabel(roundCount)}`;
}
