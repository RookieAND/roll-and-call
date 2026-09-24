const DAY = 86_400_000;

// 들어온 날부터 센 날수. 오늘 들어왔어도 1일로 센다.
export function waitedDays(since: Date, now: number = Date.now()) {
  return Math.max(1, Math.floor((now - since.getTime()) / DAY));
}
