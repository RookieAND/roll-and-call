import { isAttendanceDue, isSessionEnded } from "@/entities/game";

import { ATTENDANCE_STAGE } from "../model/attendance-stage";

export function attendanceStageOf({
  game,
  confirmedCount,
}: {
  game: Parameters<typeof isAttendanceDue>[0]["game"];
  confirmedCount: number;
}) {
  if (isAttendanceDue({ game, confirmedCount })) return ATTENDANCE_STAGE.due;
  if (game.attendanceConfirmedAt && isSessionEnded(game)) return ATTENDANCE_STAGE.done;
  return null;
}
