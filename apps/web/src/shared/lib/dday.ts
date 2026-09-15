// 사용자 로컬 타임존 기준이라 클라이언트에서만 호출한다. 서버는 ddayKst.
export function dday(target: Date | string, now: Date = new Date()): number {
  const targetDate = new Date(target);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.round((targetDay.getTime() - today.getTime()) / 86_400_000);
}
