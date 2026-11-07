import { padTwoDigits, rowSlotIso, SLOT_MINUTES, type TimeRow } from "@/shared/lib";

const MINUTES_PER_DAY = 24 * 60;

// 한 열(날짜)에서 고른 줄을 이어지는 구간으로 묶어 「20:00 – 22:00, 23:00 – 23:30」로 쓴다. 고른 줄이 없으면 빈 문자열이다.
export function dayRangesText({
  date,
  timeRows,
  isIncluded,
}: {
  date: string;
  timeRows: TimeRow[];
  isIncluded: (slotKey: string) => boolean;
}): string {
  const runs: { first: TimeRow; last: TimeRow; lastIndex: number }[] = [];
  timeRows.forEach((row, index) => {
    if (!isIncluded(rowSlotIso({ date, row }))) return;
    const current = runs.at(-1);
    if (current && current.lastIndex === index - 1) {
      current.last = row;
      current.lastIndex = index;
    } else runs.push({ first: row, last: row, lastIndex: index });
  });
  return runs
    .map(({ first, last }) => {
      const end = (last.hour * 60 + last.minute + SLOT_MINUTES) % MINUTES_PER_DAY;
      return `${first.label} – ${padTwoDigits(Math.floor(end / 60))}:${padTwoDigits(end % 60)}`;
    })
    .join(", ");
}
