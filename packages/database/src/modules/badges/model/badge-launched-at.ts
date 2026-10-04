// 업적 알림을 연 시각. 이보다 앞서 얻은 업적은 출시 소급분이라 알림 줄 없이 「지금까지의 업적」 시트로만 알린다.
export const BADGE_LAUNCHED_AT = new Date("2026-10-05T00:00:00+09:00");

export function isRetroBadge(earnedAt: Date): boolean {
  return earnedAt.getTime() < BADGE_LAUNCHED_AT.getTime();
}
