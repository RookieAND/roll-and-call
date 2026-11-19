import { isNil } from "es-toolkit";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";

type Moment = Date | string | null;

// 완주: 구인이 끝났을 때 확정으로 남아 있고, 중도에 합류하지도 하차·내보내기·서버 이탈로 빠지지도 않은 사람.
// 회차에 빠진 적이 있어도 끝까지 명단에 남으면 완주다. 조기 종결도 구인이 끝난 것으로 본다.
export function isFinisher({
  game,
  participant,
}: {
  game: { finishedAt: Moment; cancelledAt: Moment };
  participant: { status: ParticipantStatus; lateJoined: boolean; leftReason: string | null };
}): boolean {
  if (isNil(game.finishedAt) || !isNil(game.cancelledAt)) return false;
  return (
    participant.status === PARTICIPANT_STATUS.confirmed &&
    !participant.lateJoined &&
    isNil(participant.leftReason)
  );
}
