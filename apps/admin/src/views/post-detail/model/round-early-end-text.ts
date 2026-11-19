import { toKst } from "@roll-and-call/app-kit/date";
import { clockTextLabel } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import type { AdminRound } from "./admin-rounds";

// GM이 예정보다 일찍 마친 회차의 「오후 3:40 종료」. 아니면 null이다.
export function roundEarlyEndText(round: AdminRound) {
  if (isNull(round.endedAt) || isNull(round.plannedEndAt) || round.endedAt >= round.plannedEndAt) {
    return null;
  }
  return `${clockTextLabel(toKst(round.endedAt).format("HH:mm"))} 종료`;
}
