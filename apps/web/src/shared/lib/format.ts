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
