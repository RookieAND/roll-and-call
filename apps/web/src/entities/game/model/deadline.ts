// 마감 임박 = 아직 지나지 않았고 24시간 안쪽. 카드 강조·빨강 배지·지표 강조가 같은 기준을 쓴다.
const URGENT_BEFORE_MS = 24 * 60 * 60 * 1000;

export function isDeadlineUrgent(endDate: Date | string, now: Date = new Date()): boolean {
  const remaining = new Date(endDate).getTime() - now.getTime();
  return remaining > 0 && remaining < URGENT_BEFORE_MS;
}

export function isDeadlinePassed(endDate: Date | string, now: Date = new Date()): boolean {
  return new Date(endDate).getTime() <= now.getTime();
}
