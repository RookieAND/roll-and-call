const DEFAULT_BADGE_LAUNCHED_AT = "2026-10-05T00:00:00+09:00";

// 업적 알림을 연 시각. 설정값 BADGE_LAUNCHED_AT(ISO 시각)으로 정하고, 없거나 잘못되면 기본값을 쓴다.
// 이보다 앞서 얻은 업적은 출시 소급분이라 알림 줄 없이 「지금까지의 업적」 시트로만 알린다.
function launchedAt() {
  const configured = new Date(process.env.BADGE_LAUNCHED_AT ?? DEFAULT_BADGE_LAUNCHED_AT);
  return Number.isNaN(configured.getTime()) ? new Date(DEFAULT_BADGE_LAUNCHED_AT) : configured;
}

export const BADGE_LAUNCHED_AT = launchedAt();

export function isRetroBadge(earnedAt: Date): boolean {
  return earnedAt.getTime() < BADGE_LAUNCHED_AT.getTime();
}
