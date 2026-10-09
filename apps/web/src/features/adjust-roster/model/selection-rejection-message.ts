import { SELECTION_REJECTION, type SelectionRejection } from "@roll-and-call/database/games/model";

import { APPLICATION_CLOSED_MESSAGE, GAME_NOT_FOUND_MESSAGE } from "@/shared/api";

const MESSAGES: Record<SelectionRejection, string> = {
  [SELECTION_REJECTION.notFound]: GAME_NOT_FOUND_MESSAGE,
  [SELECTION_REJECTION.notGm]: "권한이 없습니다.",
  [SELECTION_REJECTION.cancelled]: "취소된 구인은 선발할 수 없습니다.",
  [SELECTION_REJECTION.notSelection]: "선발로 모집하는 구인글이 아닙니다.",
  [SELECTION_REJECTION.alreadyFinished]: "이미 선발을 마쳤습니다.",
  [SELECTION_REJECTION.applicationClosed]: APPLICATION_CLOSED_MESSAGE,
  [SELECTION_REJECTION.noConfirmed]: "확정할 사람을 1명 이상 골라야 선발을 마칠 수 있습니다.",
  [SELECTION_REJECTION.minPlayersUnmet]: "최소 인원에 못 미쳐 선발을 마칠 수 없습니다.",
};

export function selectionRejectionMessage(
  reason: SelectionRejection,
  minPlayers: number | null,
): string {
  if (reason === SELECTION_REJECTION.minPlayersUnmet && minPlayers !== null) {
    return `최소 인원 ${minPlayers}명에 못 미쳐 선발을 마칠 수 없습니다.`;
  }
  return MESSAGES[reason];
}
