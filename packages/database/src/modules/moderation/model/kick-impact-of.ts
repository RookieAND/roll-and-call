import { isAwaitingResult } from "#/modules/games/model/is-awaiting-result";

import type { MemberOngoing } from "./member-ongoing";
import { ONGOING_ROLE } from "./ongoing-role";

export interface KickImpact {
  appliedCount: number;
  waitingCount: number;
  confirmedCount: number;
  cancelledGameCount: number;
}

// 추방하면 빠지는 신청·대기·확정과 취소되는 구인 수. 결과 전 추첨·선발 구인의 확정 상태는 아직 신청이다.
export function kickImpactOf(ongoing: readonly MemberOngoing[]): KickImpact {
  const beforeDraw = ({ game }: MemberOngoing) => isAwaitingResult(game);
  const confirmed = ongoing.filter((item) => item.role === ONGOING_ROLE.confirmed);
  return {
    appliedCount: confirmed.filter(beforeDraw).length,
    waitingCount: ongoing.filter((item) => item.role === ONGOING_ROLE.waiting).length,
    confirmedCount: confirmed.filter((item) => !beforeDraw(item)).length,
    cancelledGameCount: ongoing.filter((item) => item.role === ONGOING_ROLE.gm).length,
  };
}
