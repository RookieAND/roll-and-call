import { DIE_FACES, DRAW_REJECTION, type DrawRejection } from "@roll-and-call/database/games/model";

import {
  APPLICATION_CLOSED_MESSAGE,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
} from "@/shared/api";

const MESSAGES: Record<DrawRejection, string> = {
  [DRAW_REJECTION.notFound]: GAME_NOT_FOUND_MESSAGE,
  [DRAW_REJECTION.notGm]: "권한이 없습니다.",
  [DRAW_REJECTION.cancelled]: GAME_CANCELLED_MESSAGE,
  [DRAW_REJECTION.notLottery]: "추첨으로 모집하는 구인글이 아닙니다.",
  [DRAW_REJECTION.alreadyDrawn]: "이미 추첨을 마쳤습니다.",
  [DRAW_REJECTION.applicationClosed]: APPLICATION_CLOSED_MESSAGE,
  [DRAW_REJECTION.noApplicants]: "추첨할 신청자가 없습니다.",
  [DRAW_REJECTION.tooMany]: `추첨 신청자는 ${DIE_FACES}명까지만 굴릴 수 있습니다.`,
};

export function drawRejectionMessage(reason: DrawRejection): string {
  return MESSAGES[reason];
}
