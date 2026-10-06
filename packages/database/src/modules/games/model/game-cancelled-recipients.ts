import { isNil, uniq } from "es-toolkit";

import { GAME_CANCEL_KIND, type GameCancelKind } from "./game-cancel-kind";
import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";
import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

// GM·운영진·자동 취소가 모두 cancelGame을 지나므로 구인 취소 알림은 여기서만 만든다. 웹(W07)·어드민(A2·A3·A4)에서 따로 만들지 않는다.
// 확정자와 대기자(추첨 글의 추첨 전 신청자는 최소 인원 미달 취소일 때만 받는다), GM 취소가 아니면 GM도 받는다.
export function gameCancelledRecipients({
  game,
  kind,
  roster,
}: {
  game: { gmId: string; recruitMethod: RecruitMethod; drawnAt: Date | string | null };
  kind: GameCancelKind;
  roster: readonly { userId: string; status: ParticipantStatus }[];
}): string[] {
  // 최소 인원 미달 취소는 추첨 전 신청자에게도 알린다. 그 밖의 취소는 추첨 전 신청자를 뺀다.
  const beforeDraw =
    game.recruitMethod === RECRUIT_METHOD.lottery &&
    isNil(game.drawnAt) &&
    kind !== GAME_CANCEL_KIND.minPlayersUnmet;
  const players = roster
    .filter(
      ({ status }) =>
        status === PARTICIPANT_STATUS.confirmed ||
        (status === PARTICIPANT_STATUS.waiting && !beforeDraw),
    )
    .map(({ userId }) => userId);
  return uniq(kind === GAME_CANCEL_KIND.gm ? players : [...players, game.gmId]);
}
