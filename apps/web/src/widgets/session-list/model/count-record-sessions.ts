import { isRecordSession } from "@roll-and-call/database/badges/model";
import { isNull } from "es-toolkit";

import { countConfirmed, isSessionEnded, PARTICIPANT_STATUS } from "@/entities/game";

import type { SessionGame } from "./session-card-model";

// 마이페이지와 프로필(W08)이 같이 쓴다. 판정은 W09의 isRecordSession 하나다. 숫자는 카드 목록과 다르다(카드는 진행 중·취소됨도 보인다).
// joined는 getJoinedGames 행이라 운영진이 취소한 불참은 이미 absent false로 접혀 있다.
export function countRecordSessions({
  hosted,
  joined,
  userId,
  now = new Date(),
  includeUpcoming = false,
  includeWaiting = false,
}: {
  hosted: readonly SessionGame[];
  joined: readonly SessionGame[];
  userId: string;
  now?: Date;
  // 아직 끝나지 않은 세션(운영 중인 구인, 확정·신청해 둔 참여)도 센다. 취소된 구인은 뺀다.
  includeUpcoming?: boolean;
  // 신청만 해 둔 대기도 센다. 남의 프로필 카드엔 대기가 없으므로 내 마이페이지만 켠다.
  includeWaiting?: boolean;
}): { hosted: number; played: number } {
  const recorded = (game: SessionGame) =>
    isRecordSession({ ...game, confirmedCount: countConfirmed(game.participants) }, now);
  const upcoming = (game: SessionGame) =>
    includeUpcoming &&
    isNull(game.cancelledAt) &&
    isNull(game.hiddenAt) &&
    !isSessionEnded(game, now);
  const seated = (game: SessionGame, statuses: string[]) =>
    game.participants.some(
      (participant) =>
        participant.userId === userId &&
        statuses.includes(participant.status) &&
        !participant.absent,
    );
  return {
    hosted: hosted.filter((game) => recorded(game) || upcoming(game)).length,
    played: joined.filter(
      (game) =>
        (recorded(game) && seated(game, [PARTICIPANT_STATUS.confirmed])) ||
        (upcoming(game) &&
          seated(game, [
            PARTICIPANT_STATUS.confirmed,
            ...(includeWaiting ? [PARTICIPANT_STATUS.waiting] : []),
          ])),
    ).length,
  };
}
