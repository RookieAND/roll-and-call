import type { RoundSpan } from "./overlapping-round-numbers";

const WEEK_MS = 7 * 24 * 3_600_000;

// 매주·격주 반복 규칙으로 1회차부터 count개 회차의 일시를 만든다. 한국 시각은 서머타임이 없어 고정 간격으로 더한다.
export function buildRepeatRounds({
  first,
  intervalWeeks,
  count,
}: {
  first: RoundSpan;
  intervalWeeks: number;
  count: number;
}): RoundSpan[] {
  return Array.from({ length: count }, (_, index) => {
    const offset = index * intervalWeeks * WEEK_MS;
    return {
      startsAt: new Date(first.startsAt.getTime() + offset),
      endsAt: new Date(first.endsAt.getTime() + offset),
    };
  });
}
