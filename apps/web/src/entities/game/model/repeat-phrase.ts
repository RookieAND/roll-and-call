import { toKst } from "@/shared/lib";

import { ROUND_REPEAT_WORD, type RoundRepeatWord } from "./round-repeat";
import { roundTimeRange } from "./round-time-range";

// 「매주 토 오후 12:00~4:00」
export function repeatPhrase({
  repeat,
  startsAt,
  endsAt,
}: {
  repeat: RoundRepeatWord;
  startsAt: Date;
  endsAt: Date;
}) {
  const weekday = toKst(startsAt).format("dd");
  return `${ROUND_REPEAT_WORD[repeat]} ${weekday} ${roundTimeRange({ startsAt, endsAt })}`;
}
