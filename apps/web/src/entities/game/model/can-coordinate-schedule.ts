import type { Game } from "@/shared/server";
import { canCoordinate } from "./can-coordinate";
import type { ScheduleMode } from "./schedule-mode";
import { GAME_STATUS, type GameStatus } from "./status";

// GM 확정(confirmedAt) 전 + 모집 마감 전 + coordinate 모드일 때만 조율 진입 가능.
// context === "joined" 같은 UI 게이팅은 호출부(컴포넌트)에 남긴다.
export function canCoordinateSchedule({
  scheduleMode,
  confirmedAt,
  status,
}: {
  scheduleMode: ScheduleMode;
  confirmedAt: Game["confirmedAt"];
  status: GameStatus;
}): boolean {
  return canCoordinate({ scheduleMode }) && !confirmedAt && status !== GAME_STATUS.closed;
}
