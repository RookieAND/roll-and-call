// 날짜로 읽히지 않거나 지금보다 뒤면 지금으로 자른다.
export function readUpTo({ upTo, now }: { upTo: string; now: Date }) {
  const parsed = new Date(upTo);
  if (Number.isNaN(parsed.getTime()) || parsed > now) return now;
  return parsed;
}
