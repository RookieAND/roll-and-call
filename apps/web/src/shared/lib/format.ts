// 시안 format: "8월 16일 (일) 20:00" (KST, 24h).
export function formatDateTime(value: Date | string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .map((x) => [x.type, x.value]),
  );
  return `${p.month}월 ${p.day}일 (${p.weekday}) ${p.hour}:${p.minute}`;
}

// Slash date: "8/17" (used in 마감 sublines, KST).
export function formatMonthDay(value: Date | string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric",
    })
      .formatToParts(new Date(value))
      .map((x) => [x.type, x.value]),
  );
  return `${p.month}/${p.day}`;
}

// Date only: "8월 16일" (used for 조율 기간 ranges).
export function formatDate(value: Date | string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric",
    })
      .formatToParts(new Date(value))
      .map((x) => [x.type, x.value]),
  );
  return `${p.month}월 ${p.day}일`;
}

// 사용자 타임존(로컬) 기준 남은 "날짜 수". 오늘=0, 3일 뒤=3. 클라이언트에서만 호출.
export function dday(target: Date | string, now: Date = new Date()): number {
  const t = new Date(target);
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

// 세션 일정 한 줄 표기. 우선순위: 확정 일시 > 조율 범위 > 미정. UI와 Discord 알림이 같은 문구를 쓴다.
export function formatGameSchedule({
  scheduleMode,
  confirmedAt,
  rangeStart,
  rangeEnd,
}: {
  scheduleMode: "fixed" | "coordinate";
  confirmedAt: Date | string | null;
  rangeStart: string | null;
  rangeEnd: string | null;
}): string {
  if (confirmedAt) return formatDateTime(confirmedAt);
  if (scheduleMode === "coordinate" && rangeStart && rangeEnd) {
    return `${formatDate(rangeStart)} ~ ${formatDate(rangeEnd)} 조율`;
  }
  return "미정";
}
