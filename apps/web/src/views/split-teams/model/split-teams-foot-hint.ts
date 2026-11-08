import {
  GAME_VISIBILITY,
  SCHEDULE_MODE,
  type GameVisibility,
  type ScheduleMode,
} from "@/entities/game";

// 하단 버튼 위 안내. 다음으로 가거나 구인을 열 수 있으면 null이다.
export function splitTeamsFootHint({
  step,
  selectedCount,
  capacityMatched,
  visibility,
  scheduleMode,
  rangeStart,
  rangeEnd,
  startsAt,
  endDate,
}: {
  step: number;
  selectedCount: number;
  capacityMatched: boolean;
  visibility: GameVisibility;
  scheduleMode: ScheduleMode;
  rangeStart: string;
  rangeEnd: string;
  startsAt: string;
  endDate: string;
}): string | null {
  if (step === 0) {
    return selectedCount === 0 ? "참여자를 고르면 다음으로 갈 수 있습니다." : null;
  }
  if (!capacityMatched) return "정원과 선택한 참여자 수를 맞추면 구인을 열 수 있습니다.";
  if (scheduleMode === SCHEDULE_MODE.fixed) {
    if (!startsAt) return "세션 일시를 고르면 구인을 열 수 있습니다.";
  } else if (!rangeStart || !rangeEnd) {
    return "조율 기간과 시간대를 고르면 구인을 열 수 있습니다.";
  }
  if (visibility === GAME_VISIBILITY.public && !endDate) {
    return "모집 마감을 고르면 구인을 열 수 있습니다.";
  }
  return null;
}
