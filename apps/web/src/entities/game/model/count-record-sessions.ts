import { isRecordSession } from "@roll-and-call/database/badges/model";
import { isSessionInProgress } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { countConfirmed, PARTICIPANT_STATUS } from "./participant";
import type { SessionGame } from "./session-game";

// SQL판은 packages/database의 member-session-counts-sql.ts(includeInProgress 켠 경우). 정의를 바꾸면 함께 바꾼다.
// 마이페이지와 프로필(W08)이 같이 쓴다. 판정은 W09의 isRecordSession 하나다. 숫자는 카드 목록과 다르다(카드는 진행 중·취소됨도 보인다).
// joined는 getJoinedGames 행이라 운영진이 취소한 불참은 이미 absent false로 접혀 있다.
export function countRecordSessions({
  hosted,
  joined,
  userId,
  now = new Date(),
  includeInProgress = false,
}: {
  hosted: readonly SessionGame[];
  joined: readonly SessionGame[];
  userId: string;
  now?: Date;
  // 시작했지만 아직 끝나지 않은 세션도 센다. 시작 전 세션(참여 예정)과 대기는 세지 않는다. 취소된 구인은 뺀다.
  includeInProgress?: boolean;
}): { hosted: number; played: number } {
  const recorded = (game: SessionGame) =>
    isRecordSession({ ...game, confirmedCount: countConfirmed(game.participants) }, now);
  const inProgress = (game: SessionGame) =>
    includeInProgress &&
    isNull(game.cancelledAt) &&
    isNull(game.hiddenAt) &&
    isSessionInProgress(game, now);
  const seated = (game: SessionGame, statuses: string[]) =>
    game.participants.some(
      (participant) =>
        participant.userId === userId &&
        statuses.includes(participant.status) &&
        !participant.absent,
    );
  // 다회차는 출석을 확정하고 끝난 회차 가운데 참석한 회차마다 하나다. 구인을 끝까지 하지 않아도 센다.
  const playedOf = (game: SessionGame) => {
    if (game.roundCount > 1)
      return isNull(game.cancelledAt) && isNull(game.hiddenAt) ? (game.attendedRoundCount ?? 0) : 0;
    const counted =
      (recorded(game) || inProgress(game)) && seated(game, [PARTICIPANT_STATUS.confirmed]);
    return counted ? 1 : 0;
  };
  return {
    hosted: hosted.filter((game) => recorded(game) || inProgress(game)).length,
    played: joined.reduce((total, game) => total + playedOf(game), 0),
  };
}
