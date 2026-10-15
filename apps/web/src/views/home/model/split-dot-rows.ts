export const MAX_CALENDAR_DOTS = 8;
// 1100px 이상 달력 칸은 점 대신 세션 이름을 이 개수까지 세로로 쌓고, 나머지는 「+N」으로 센다.
export const MAX_CALENDAR_NAMES = 2;
const SINGLE_ROW_DOTS = 3;

// 3개까지는 한 줄, 4개부터는 두 줄로 나누고 5개부터 아래 줄이 먼저 늘어난다.
export function splitDotRows<Item>(items: Item[]): Item[][] {
  if (items.length <= SINGLE_ROW_DOTS) return [items];
  const topCount = Math.floor(items.length / 2);
  return [items.slice(0, topCount), items.slice(topCount)];
}
