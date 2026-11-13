import type { GameRepeatRule } from "#db/schema";

import { KST_OFFSET_MS } from "./kst-offset";
import type { RoundSpan } from "./overlapping-round-numbers";

const pad = (value: number) => String(value).padStart(2, "0");

function kstClock(date: Date) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  return {
    weekday: shifted.getUTCDay(),
    time: `${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`,
  };
}

// 매주·격주로 만든 구인이 저장하는 규칙. 요일과 시각은 1회차를 따르고 한국 시각이다.
export function repeatRuleOf({
  first,
  intervalWeeks,
}: {
  first: RoundSpan;
  intervalWeeks: number;
}): GameRepeatRule {
  const start = kstClock(first.startsAt);
  return {
    weekday: start.weekday,
    startTime: start.time,
    endTime: kstClock(first.endsAt).time,
    intervalWeeks,
  };
}
