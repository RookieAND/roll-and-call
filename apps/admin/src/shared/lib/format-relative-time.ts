const relative = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

const STEPS = [
  { unit: "day", milliseconds: 86_400_000 },
  { unit: "hour", milliseconds: 3_600_000 },
  { unit: "minute", milliseconds: 60_000 },
] as const;

// "방금", "10분 전", "어제"
export function formatRelativeTime(date: Date, now: Date = new Date()) {
  const elapsed = now.getTime() - date.getTime();
  const step = STEPS.find((candidate) => elapsed >= candidate.milliseconds);
  if (!step) return "방금";
  return relative.format(-Math.floor(elapsed / step.milliseconds), step.unit);
}
