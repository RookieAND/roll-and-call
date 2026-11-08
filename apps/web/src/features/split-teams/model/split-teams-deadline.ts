import { GAME_VISIBILITY, type GameVisibility } from "@/entities/game";

import { SPLIT_TEAMS_MESSAGE } from "./split-teams-rules";
import type { SplitTeamsScheduleColumns } from "./split-teams-schedule";

// 새 구인의 모집 마감. 지정 모집은 마감을 쓰지 않아 null이다(칼럼은 세션 시작으로 채운다).
// 일반 모집은 지금 이후여야 하고 세션(조율은 조율 시작일 0시 KST)보다 늦을 수 없다.
export function splitTeamsDeadline({
  visibility,
  endsAt,
  schedule,
  now = new Date(),
}: {
  visibility: GameVisibility;
  endsAt: string | undefined;
  schedule: SplitTeamsScheduleColumns;
  now?: Date;
}): { endDate: Date | null } | { error: string } {
  if (visibility === GAME_VISIBILITY.private) return { endDate: null };
  const endDate = endsAt ? new Date(endsAt) : null;
  if (!endDate || endDate.getTime() <= now.getTime()) {
    return { error: SPLIT_TEAMS_MESSAGE.deadline };
  }
  const sessionStart =
    schedule.confirmedAt ??
    (schedule.rangeStart ? new Date(`${schedule.rangeStart}T00:00:00+09:00`) : null);
  if (sessionStart && endDate.getTime() > sessionStart.getTime()) {
    return { error: SPLIT_TEAMS_MESSAGE.deadlineLate };
  }
  return { endDate };
}
