const DAY_MS = 24 * 60 * 60 * 1000;

// end·today는 KST 날짜 문자열.
export function remainingText({ end, today }: { end: string; today: string }) {
  const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS;
  if (days <= 0) return "오늘 마감입니다";
  return `마감까지 ${days}일 남았습니다`;
}
