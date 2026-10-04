import {
  END_SESSION_BLOCK,
  UNDO_END_SESSION_BLOCK,
  type EndSessionBlock,
  type UndoEndSessionBlock,
} from "@roll-and-call/database/games/model";

import { GAME_CANCELLED_MESSAGE } from "@/shared/api";

export const END_SESSION_MESSAGES = {
  [END_SESSION_BLOCK.notGm]: "권한이 없습니다.",
  [END_SESSION_BLOCK.cancelled]: GAME_CANCELLED_MESSAGE,
  [END_SESSION_BLOCK.notStarted]: "아직 시작하지 않은 세션입니다.",
  [END_SESSION_BLOCK.alreadyEnded]: "이미 마친 세션입니다.",
  [END_SESSION_BLOCK.sessionOver]: "이미 끝난 세션입니다.",
  [END_SESSION_BLOCK.noConfirmed]: "확정 참여자가 없습니다.",
} as const satisfies Record<EndSessionBlock, string>;

export const UNDO_END_SESSION_MESSAGES = {
  [UNDO_END_SESSION_BLOCK.notGm]: "권한이 없습니다.",
  [UNDO_END_SESSION_BLOCK.notEnded]: "이미 진행 중인 세션입니다.",
  [UNDO_END_SESSION_BLOCK.attendanceConfirmed]: "출석을 확정한 세션은 되돌릴 수 없습니다.",
  [UNDO_END_SESSION_BLOCK.windowOver]: "되돌릴 수 있는 시간이 지났습니다.",
} as const satisfies Record<UndoEndSessionBlock, string>;
