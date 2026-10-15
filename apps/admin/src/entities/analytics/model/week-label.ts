const SEOUL_OFFSET = 9 * 3_600_000;

// 그 달의 몇 번째 7일인지로 센다(ISO 주차 아님).
export function weekLabel(date: Date) {
  const seoul = new Date(date.getTime() + SEOUL_OFFSET);
  return `${seoul.getUTCMonth() + 1}월 ${Math.ceil(seoul.getUTCDate() / 7)}주차`;
}
