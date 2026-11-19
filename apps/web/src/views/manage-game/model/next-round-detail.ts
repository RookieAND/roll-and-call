import type { GameRoundRow } from "@roll-and-call/database/games";

import { roundSlotLabel } from "@/entities/game";

// 운영 관리 「회차 일정」 줄의 설명. 제목은 늘 「회차 일정」이고, 다음 회차 일시와 진행 위치를 여기에 푼다.
export function nextRoundDetail({
  next,
  finished,
  roundCount,
}: {
  next: GameRoundRow | undefined;
  finished: boolean;
  roundCount: number;
}) {
  if (next?.startAt && next.plannedEndAt) {
    const slot = roundSlotLabel({ startsAt: next.startAt, endsAt: next.plannedEndAt });
    return `다음 회차 · ${slot} · ${next.roundNo}/${roundCount}회`;
  }
  if (finished) return `총 ${roundCount}회`;
  return `다음 회차 일정 없음 · 총 ${roundCount}회`;
}
