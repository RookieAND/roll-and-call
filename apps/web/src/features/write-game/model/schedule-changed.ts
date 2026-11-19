import { SCHEDULE_MODE } from "@/entities/game";

import type { LockedGame } from "./edit-block-reason";
import type { toGameColumns } from "./to-game-columns";

const toMinute = (date: Date | null | undefined) =>
  date ? Math.floor(date.getTime() / 60_000) : null;

// 다회차는 수정이 game_rounds를 맞추지 않아서 1회차 일정(방식·일시·조율 기간·시간대)을 바꿀 수 없다.
export function scheduleChanged(
  game: LockedGame,
  columns: ReturnType<typeof toGameColumns>,
): boolean {
  if (columns.scheduleMode !== game.scheduleMode) return true;
  if (columns.scheduleMode === SCHEDULE_MODE.fixed) {
    return toMinute(columns.confirmedAt) !== toMinute(game.confirmedAt);
  }
  return (
    columns.rangeStart !== game.rangeStart ||
    columns.rangeEnd !== game.rangeEnd ||
    columns.windowStartHour !== game.windowStartHour ||
    columns.windowEndHour !== game.windowEndHour
  );
}
