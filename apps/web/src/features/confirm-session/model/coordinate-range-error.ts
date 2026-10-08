import { isStartInCoordinationRange } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { coordinationWindowOf } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

export function coordinateRangeError({
  game,
  startsAt,
}: {
  game: Parameters<typeof coordinationWindowOf>[0] & {
    rangeStart: string | null;
    rangeEnd: string | null;
  };
  startsAt: Date;
}): ActionResult | null {
  const inRange =
    !isNil(game.rangeStart) &&
    !isNil(game.rangeEnd) &&
    isStartInCoordinationRange({
      startsAt,
      rangeStart: game.rangeStart,
      rangeEnd: game.rangeEnd,
      window: coordinationWindowOf(game),
    });
  return inRange ? null : { error: "조율 기간 안의 날짜를 골라 주세요." };
}
