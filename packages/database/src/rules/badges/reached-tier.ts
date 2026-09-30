import type { BadgeStep } from "./badge-ladder";

export type BadgeEvent = { at: Date; gameId: string | null };

// events는 시각 오름차순. 도달한 가장 높은 단계와, 그 기준을 넘긴 사건이 획득 시각·근거다.
export function reachedTier(steps: BadgeStep[], events: BadgeEvent[]) {
  const tier = steps.filter((step) => step.threshold <= events.length).length;
  if (tier === 0) return null;
  const event = events[steps[tier - 1]!.threshold - 1]!;
  return { tier, earnedAt: event.at, sourceGameId: event.gameId };
}
