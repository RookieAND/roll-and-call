import { isRecordSession } from "@roll-and-call/database/badges/model";

import { countConfirmed, PARTICIPANT_STATUS } from "@/entities/game";

import type { SessionGame } from "./session-card-model";

// 마이페이지와 프로필(W08)이 같이 쓴다. 판정은 W09의 isRecordSession 하나다. 숫자는 카드 목록과 다르다(카드는 진행 중·취소됨도 보인다).
// joined는 getJoinedGames 행이라 운영진이 취소한 불참은 이미 absent false로 접혀 있다.
export function countRecordSessions({
  hosted,
  joined,
  userId,
  now = new Date(),
}: {
  hosted: readonly SessionGame[];
  joined: readonly SessionGame[];
  userId: string;
  now?: Date;
}): { hosted: number; played: number } {
  const recorded = (game: SessionGame) =>
    isRecordSession({ ...game, confirmedCount: countConfirmed(game.participants) }, now);
  return {
    hosted: hosted.filter(recorded).length,
    played: joined.filter(
      (game) =>
        recorded(game) &&
        game.participants.some(
          (participant) =>
            participant.userId === userId &&
            participant.status === PARTICIPANT_STATUS.confirmed &&
            !participant.absent,
        ),
    ).length,
  };
}
