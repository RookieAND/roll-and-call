// "YYYY-MM-DD"의 하루 전. 타임존과 무관하게 달력 날짜로만 센다.
export function previousDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// 모집 마감 기본값: 범위 조율은 조율 시작 하루 전 19:00, 일시 지정은 세션 하루 전 같은 시각.
export function defaultEndDateForRange(rangeStart: string): string {
  return `${previousDay(rangeStart)}T19:00`;
}

export function defaultEndDateForSession(confirmedAt: string): string {
  const [date = "", time = "19:00"] = confirmedAt.split("T");
  return date ? `${previousDay(date)}T${time}` : "";
}
