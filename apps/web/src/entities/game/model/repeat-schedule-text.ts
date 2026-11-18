import { repeatPhrase } from "./repeat-phrase";
import type { RoundRepeatWord } from "./round-repeat";
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
  return `${repeatPhrase({ repeat, startsAt, endsAt })} · ${roundTotalLabel(roundCount)}`;
}
