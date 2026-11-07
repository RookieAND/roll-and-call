import { nextQuestInTrack, type OnboardingQuest } from "@roll-and-call/database/onboarding/model";

import { QUEST_LIST_PATH, QUEST_PATH } from "@/shared/lib";

export const CLEAR_TARGET = { list: "list", next: "next" } as const;
// 목록, 같은 갈래의 다음 퀘스트, 또는 실제 서비스의 서버 안 주소(/games 등).
export type ClearTarget = (typeof CLEAR_TARGET)[keyof typeof CLEAR_TARGET] | `/${string}`;

// 클리어를 기록한 뒤 갈 서버 안 주소. 업적을 받았으면 어디로 가든 목록의 업적 시트를 먼저 보인다.
export function clearedDestination({
  quest,
  to,
  badgeGranted,
}: {
  quest: OnboardingQuest;
  to: ClearTarget;
  badgeGranted: boolean;
}): string {
  const params = new URLSearchParams({ cleared: quest });
  const listPath = `${QUEST_LIST_PATH}?${params}`;
  if (badgeGranted) return `${listPath}&achievement=1`;
  if (to === CLEAR_TARGET.list) return listPath;
  if (to === CLEAR_TARGET.next) {
    const next = nextQuestInTrack(quest);
    return next ? QUEST_PATH[next] : listPath;
  }
  return to;
}
