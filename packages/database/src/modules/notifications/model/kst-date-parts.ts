const formatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "numeric",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function kstDateParts(value: string) {
  const parts = new Map(
    formatter.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  );
  return {
    month: parts.get("month"),
    day: parts.get("day"),
    weekday: parts.get("weekday"),
    time: `${parts.get("hour")}:${parts.get("minute")}`,
  };
}
