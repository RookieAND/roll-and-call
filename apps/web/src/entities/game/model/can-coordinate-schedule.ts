import type { Game } from "@/shared/server";

import { canCoordinate } from "./can-coordinate";
import type { ScheduleMode } from "./schedule-mode";
import { GAME_STATUS, type GameStatus } from "./status";

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
