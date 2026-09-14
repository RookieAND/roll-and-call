import type { Game } from "@/shared/server";
import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";

// 참여 신청·취소·명단 조정이 잠기는가.
// - 조율형: GM이 일정을 확정(confirmedAt)하는 순간 잠긴다. 그 시각에 맞춰 모인 명단이기 때문이다.
// - 일시 지정형: confirmedAt은 등록할 때부터 있는 세션 시각일 뿐이라, 모집 마감까지는 열려 있다.
// 어느 쪽이든 세션 시각이 지나면 잠긴다.
export function isSessionLocked({
  scheduleMode,
  confirmedAt,
  now = Date.now(),
}: {
  scheduleMode: ScheduleMode;
  confirmedAt: Game["confirmedAt"];
  now?: number;
}): boolean {
  if (!confirmedAt) return false;
  if (scheduleMode === SCHEDULE_MODE.coordinate) return true;
  return new Date(confirmedAt).getTime() <= now;
}
