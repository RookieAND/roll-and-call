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
