import { formatPlayMinutes } from "./format-play-minutes";

const HOUR = 60;

// 최소~최대를 "3~5시간"처럼 읽는 글로 바꾼다. 같은 값이면 하나만, 값이 없으면 null.
export function formatPlayRange(min: number | null, max: number | null): string | null {
  const upper = max ?? min;
  const lower = min ?? max;
  if (!upper || !lower) return null;
  if (lower === upper) return formatPlayMinutes(upper);
  if (lower % HOUR === 0 && upper % HOUR === 0)
    return `${lower / HOUR}~${formatPlayMinutes(upper)}`;
  if (lower < HOUR && upper < HOUR) return `${lower}~${upper}분`;
  return `${formatPlayMinutes(lower)}~${formatPlayMinutes(upper)}`;
}
