// <input type="date|datetime-local">와 주고받는 문자열 헬퍼.
// 값은 항상 사용자 로컬 시각 기준이며, 날짜는 "YYYY-MM-DD", 일시는 "YYYY-MM-DDTHH:mm" 형태다.
const pad = (n: number) => String(n).padStart(2, "0");

export function toLocalDateTimeInput(value: Date | string): string {
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toLocalDateInput(value: Date | string): string {
  return toLocalDateTimeInput(value).slice(0, 10);
}

// "YYYY-MM-DD"에 n일을 더한다. UTC 기준으로 계산해 DST 영향을 받지 않는다.
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// 종료일이 고를 수 있는 범위. 시작일 다음 날부터 maxDays 뒤까지 열어 준다.
// 시작일이 아직 없으면 하한(earliest)만 걸고 상한은 두지 않는다.
export function endDateBounds({
  start,
  earliest,
  maxDays,
}: {
  start?: string;
  earliest?: string;
  maxDays: number;
}): { min?: string; max?: string } {
  if (!start) return { min: earliest, max: undefined };
  return { min: addDays(start, 1), max: addDays(start, maxDays) };
}
