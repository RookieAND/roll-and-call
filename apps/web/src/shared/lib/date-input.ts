// <input type="date|datetime-local">와 주고받는 문자열 헬퍼.
// 입력값은 항상 KST 벽시계 기준이다: 날짜 "YYYY-MM-DD", 일시 "YYYY-MM-DDTHH:mm".
// DB에는 UTC 순간으로 저장하고, 화면(format.ts)과 입력(여기)은 KST로 보여준다.
// 서버(Vercel)는 UTC라 new Date("YYYY-MM-DDTHH:mm")로 읽으면 9시간 밀리므로 반드시 이 헬퍼를 거친다.
const pad = (n: number) => String(n).padStart(2, "0");

// sv-SE 로케일은 "YYYY-MM-DD HH:mm" 모양을 준다.
const kstFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// 저장된 순간 → KST 입력 문자열 "YYYY-MM-DDTHH:mm"
export function toKstDateTimeInput(value: Date | string): string {
  return kstFormat.format(new Date(value)).replace(" ", "T");
}

// 저장된 순간 → KST 날짜 "YYYY-MM-DD"
export function toKstDateInput(value: Date | string): string {
  return toKstDateTimeInput(value).slice(0, 10);
}

// KST 입력 문자열 "YYYY-MM-DDTHH:mm" → 저장할 순간(Date). 실행 환경의 타임존과 무관하다.
export function fromKstDateTimeInput(value: string): Date {
  return new Date(`${value}:00+09:00`);
}

// "YYYY-MM-DD"에 n일을 더한다. UTC 기준으로 계산해 DST 영향을 받지 않는다.
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
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
