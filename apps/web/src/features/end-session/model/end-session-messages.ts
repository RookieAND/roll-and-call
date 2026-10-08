import { END_SESSION_BLOCK, type EndSessionBlock } from "@roll-and-call/database/games/model";

import { GAME_CANCELLED_MESSAGE } from "@/shared/api";

export const END_SESSION_MESSAGES = {
  [END_SESSION_BLOCK.notGm]: "권한이 없습니다.",
  [END_SESSION_BLOCK.cancelled]: GAME_CANCELLED_MESSAGE,
  [END_SESSION_BLOCK.notStarted]: "아직 시작하지 않은 세션입니다.",
  [END_SESSION_BLOCK.alreadyEnded]: "이미 마친 세션입니다.",
  [END_SESSION_BLOCK.sessionOver]: "이미 끝난 세션입니다.",
  [END_SESSION_BLOCK.noConfirmed]: "확정 참여자가 없습니다.",
} as const satisfies Record<EndSessionBlock, string>;
