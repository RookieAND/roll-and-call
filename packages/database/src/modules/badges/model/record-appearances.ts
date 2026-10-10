import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { RANKING_MODE, type RankingMode } from "#/modules/servers/model/ranking-mode";

import { BADGE_ROLE } from "./badge-ladder";
import { countsAsAttended } from "./counts-as-attended";
import { countsForRanking } from "./counts-for-ranking";
import type { MonthlyAppearance } from "./monthly-winners";
import {
  ABSENCE_POINTS,
  crowdBonusPoints,
  rankingSessionKind,
  REVIEW_POINTS,
  SESSION_POINTS,
} from "./ranking-points";
import { isRecordSession, type RecordGame } from "./record-session";

function isActiveAbsence(participant: RecordGame["participants"][number]): boolean {
  return participant.absent && !participant.absenceCancelledAt;
}

// 참여 횟수제: 기록 세션마다 GM 한 번, 참석으로 치는 확정자 한 번씩. 타이만은 센다.
function countAppearances(game: RecordGame, startsAt: Date): MonthlyAppearance[] {
  return [
    { userId: game.gmId, role: BADGE_ROLE.gm, startsAt, weight: 1, sessions: 1 },
    ...game.participants.filter(countsAsAttended).map((participant) => ({
      userId: participant.userId,
      role: BADGE_ROLE.player,
      startsAt,
      weight: 1,
      sessions: 1,
    })),
  ];
}

// 포인트제: 세션 종류별 점수를 GM과 참석자에게 주고, GM에게는 다인원 가점을 더한다.
// 불참으로 기록된 사람은 PL·GM 점수 모두에서 뺀다. 운영진이 취소한 불참은 뺀다.
function pointAppearances(game: RecordGame, startsAt: Date): MonthlyAppearance[] {
  const attended = game.participants.filter(countsAsAttended);
  const kind = rankingSessionKind({
    attendedCount: attended.length,
    miniRule: game.miniRule ?? false,
  });
  const points = SESSION_POINTS[kind];
  const gmPoints = points + crowdBonusPoints({ kind, attendedCount: attended.length });
  const absences = game.participants.filter(isActiveAbsence).flatMap((participant) =>
    [BADGE_ROLE.gm, BADGE_ROLE.player].map((role) => ({
      userId: participant.userId,
      role,
      startsAt,
      weight: ABSENCE_POINTS,
      sessions: 0,
    })),
  );
  return [
    { userId: game.gmId, role: BADGE_ROLE.gm, startsAt, weight: gmPoints, sessions: 1 },
    ...attended.map((participant) => ({
      userId: participant.userId,
      role: BADGE_ROLE.player,
      startsAt,
      weight: points,
      sessions: 1,
    })),
    ...absences,
  ];
}

// 순위에 들어가는 출연. 참여 횟수제는 타이만(1:1)을 빼고, 포인트제는 모두 센다.
export function recordAppearances(
  games: RecordGame[],
  now: Date,
  { mode = RANKING_MODE.count }: { mode?: RankingMode } = {},
): MonthlyAppearance[] {
  return games.flatMap((game) => {
    const confirmedCount = game.participants.filter(
      (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
    ).length;
    if (!isRecordSession({ ...game, confirmedCount }, now)) return [];
    const startsAt = new Date(game.confirmedAt!);
    if (mode === RANKING_MODE.points) return pointAppearances(game, startsAt);
    return countsForRanking(game) ? countAppearances(game, startsAt) : [];
  });
}

// 공개 상태이고 공백 제외 10자 이상인 참석자 후기 1건마다 PL 점수를 준다. 후기를 처음 공개한 달에 센다.
export function reviewAppearances(
  reviews: { authorId: string; createdAt: Date }[],
): MonthlyAppearance[] {
  return reviews.map((review) => ({
    userId: review.authorId,
    role: BADGE_ROLE.player,
    startsAt: review.createdAt,
    weight: REVIEW_POINTS,
    sessions: 0,
  }));
}
