import type { GameRoundRow } from "@roll-and-call/database/games";

import { roundSlotLabel } from "@/entities/game";

// 운영 관리 「회차 일정」 줄의 문구. 다음 회차가 정해졌으면 일시, 끝난 구인이면 제목만, 아니면 일정을 잡아 달라는 말.
export function nextRoundLabel({
  next,
  finished,
}: {
  next: GameRoundRow | undefined;
  finished: boolean;
}) {
  if (next?.startAt && next.plannedEndAt) {
    return `다음 회차 · ${roundSlotLabel({ startsAt: next.startAt, endsAt: next.plannedEndAt })}`;
  }
  if (finished) return "회차 일정";
  return "다음 회차 · 일정을 잡아 주세요";
}
