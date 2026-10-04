import { isNil } from "es-toolkit";

import { GAME_CANCEL_KIND, PARTICIPANT_STATUS } from "@/entities/game";

import { confirmedActionView } from "./confirmed-action-view";
import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";
import { gmActionView } from "./gm-action-view";
import { outsiderActionView } from "./outsider-action-view";
import { waitingActionView } from "./waiting-action-view";

// 순서가 곧 우선순위: 취소됨 > GM > 불참 기록 > 확정자 > 대기·신청자 > 참여 기록 없음.
// 내 참여 상태 칩은 두지 않고 내 상태는 이 안내 문장으로만 보인다(D280).
export function deriveActionView(context: ActionContext): GameActionView {
  const { game, viewer } = context;
  if (game.cancelledAt) {
    return {
      kind: GAME_ACTION_VIEW.cancelled,
      cancelKind: game.cancelKind ?? GAME_CANCEL_KIND.staff,
      reason: game.cancelReason,
      isGm: viewer.isGm,
    };
  }
  if (viewer.isGm) return gmActionView(context);

  const absent =
    viewer.status === PARTICIPANT_STATUS.removed ||
    (viewer.status === PARTICIPANT_STATUS.confirmed &&
      viewer.absent &&
      isNil(viewer.absenceCancelledAt));
  if (absent) return { kind: GAME_ACTION_VIEW.absent };

  if (viewer.status === PARTICIPANT_STATUS.confirmed) return confirmedActionView(context);
  if (viewer.status === PARTICIPANT_STATUS.waiting) return waitingActionView(context);
  return outsiderActionView(context);
}
