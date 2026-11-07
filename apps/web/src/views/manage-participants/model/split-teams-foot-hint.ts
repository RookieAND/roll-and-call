import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

// 구인 열기 버튼 위 안내. 아무도 고르지 않았거나 다 채웠으면 null이다.
export function splitTeamsFootHint({
  selectedCount,
  capacityMatched,
  scheduleMode,
  rangeStart,
  rangeEnd,
  startsAt,
}: {
  selectedCount: number;
  capacityMatched: boolean;
  scheduleMode: ScheduleMode;
  rangeStart: string;
  rangeEnd: string;
  startsAt: string;
}): string | null {
  if (selectedCount === 0) return null;
  if (!capacityMatched) return "정원과 선택한 참여자 수를 맞추면 구인을 열 수 있습니다.";
  if (scheduleMode === SCHEDULE_MODE.fixed) {
    return startsAt ? null : "세션 일시를 고르면 구인을 열 수 있습니다.";
  }
  if (!rangeStart) return "조율 기간을 고르면 구인을 열 수 있습니다.";
  return rangeEnd ? null : "종료일을 고르면 구인을 열 수 있습니다.";
}
