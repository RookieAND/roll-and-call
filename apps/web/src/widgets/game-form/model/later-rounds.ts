import {
  buildRepeatRounds,
  ROUND_COUNT_MAX,
  ROUND_COUNT_MIN,
} from "@roll-and-call/database/games/model";

import { ROUND_REPEAT, ROUND_REPEAT_WEEKS, type RoundRepeat } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { fromKstDateTimeInput, toKstDateTimeInput } from "@/shared/lib";

export type LaterRound = NonNullable<GameFormValues["laterRounds"]>[number];

const MINUTE_MS = 60_000;
const WEEK_MS = 7 * 24 * 60 * MINUTE_MS;

function parse(value: string | undefined) {
  if (!value) return null;
  const date = fromKstDateTimeInput(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// 1회차를 매주·격주로 되풀이한 2회차부터의 행. 사용자가 고친 행(edited)은 그대로 둔다.
// 1회차나 회차 수가 아직 올바르지 않으면 null이다.
export function syncLaterRounds({
  firstStart,
  firstEnd,
  repeat,
  roundCount,
  current,
}: {
  firstStart: string | undefined;
  firstEnd: string | undefined;
  repeat: RoundRepeat;
  roundCount: number | undefined;
  current: readonly LaterRound[];
}): LaterRound[] | null {
  const startsAt = parse(firstStart);
  const endsAt = parse(firstEnd);
  const isCountValid =
    Number.isInteger(roundCount) &&
    roundCount! >= ROUND_COUNT_MIN &&
    roundCount! <= ROUND_COUNT_MAX;
  if (repeat === ROUND_REPEAT.custom || !startsAt || !endsAt || !isCountValid) return null;

  return buildRepeatRounds({
    first: { startsAt, endsAt },
    intervalWeeks: ROUND_REPEAT_WEEKS[repeat],
    count: roundCount!,
  })
    .slice(1)
    .map((span, index) => {
      const kept = current[index];
      if (kept?.edited) return kept;
      return {
        startAt: toKstDateTimeInput(span.startsAt),
        endAt: toKstDateTimeInput(span.endsAt),
        edited: false,
      };
    });
}

// 1회차 시작을 바꿀 때의 종료. 지금 길이를 지키고, 길이를 모르면 플레이타임 최대로 채운다.
export function nextFirstRoundEnd({
  prevStart,
  prevEnd,
  nextStart,
  defaultMinutes,
}: {
  prevStart: string | undefined;
  prevEnd: string | undefined;
  nextStart: string;
  defaultMinutes: number;
}) {
  const next = parse(nextStart);
  if (!next) return prevEnd ?? "";
  const start = parse(prevStart);
  const end = parse(prevEnd);
  const keptMs = start && end && end > start ? end.getTime() - start.getTime() : null;
  return toKstDateTimeInput(new Date(next.getTime() + (keptMs ?? defaultMinutes * MINUTE_MS)));
}

// 직접 입력에서 [회차 추가]를 눌렀을 때의 새 행. 앞 회차의 일주일 뒤로 채우고, 앞 회차가 비었으면 빈 행이다.
export function nextCustomRound(
  previous: { startAt: string; endAt: string } | undefined,
): LaterRound {
  const start = parse(previous?.startAt);
  const end = parse(previous?.endAt);
  if (!start || !end) return { startAt: "", endAt: "", edited: false };
  return {
    startAt: toKstDateTimeInput(new Date(start.getTime() + WEEK_MS)),
    endAt: toKstDateTimeInput(new Date(end.getTime() + WEEK_MS)),
    edited: false,
  };
}
