import { and, asc, count, eq, gt, isNotNull, isNull, max, sql } from "drizzle-orm";
import { isNil } from "es-toolkit";

import { db } from "#db/client";
import type { BadgeFacts } from "#db/modules/badges/model/badge-facts";
import { HIDDEN_LADDER } from "#db/modules/badges/model/badge-ladder";
import { GAME_KIND } from "#db/modules/games/model";
import { RECRUIT_METHOD } from "#db/modules/games/model";
import { firstRoundStartSql } from "#db/modules/games/queries/first-round-sql";
import {
  drawResults,
  gameRounds,
  games,
  homebrewRuleApplications,
  participants,
  roundAttendances,
  serverMembers,
  sessionReviews,
  userBadges,
} from "#db/schema";

import { attendedWhere } from "./attended-where";
import { countedReviewWhere } from "./counted-review-where";
import { recognizedGamesWhere } from "./recognized-games-where";
import { attendedCount } from "./session-columns";

// 대기 명단에서 굴린 값이 가장 작은 사람이 대기 1번이다(작을수록 앞).
const isFirstWaiting = sql<boolean>`${drawResults.status} = 'waiting' and not exists (
  select 1 from ${drawResults} as ahead
  where ahead.game_id = ${drawResults.gameId}
    and ahead.status = 'waiting'
    and ahead.roll < ${drawResults.roll}
)`;

// 확정자 가운데 내 값이 가장 크면 마지막 자리다. 굴리지 않고 미리 확정된 사람(roll 없음)은 비교에서 빠진다.
const isLastSeat = sql<boolean>`${drawResults.status} = 'confirmed' and not exists (
  select 1 from ${drawResults} as other
  where other.game_id = ${drawResults.gameId}
    and other.status = 'confirmed'
    and other.roll > ${drawResults.roll}
)`;

const isContested = sql<boolean>`exists (
  select 1 from ${drawResults} as waiting
  where waiting.game_id = ${drawResults.gameId}
    and waiting.status = 'waiting'
    and waiting.roll is not null
)`;

const FULL_CAST_MIN_ATTENDED = 4;

const applicantsOfGame = sql<number>`(
  select count(*)::int from ${drawResults} as applicant
  where applicant.game_id = ${drawResults.gameId} and applicant.roll is not null
)`;

type HiddenBadgeFacts = Pick<
  BadgeFacts,
  | "draws"
  | "hostedDraws"
  | "joinedAt"
  | "rush"
  | "fullCasts"
  | "absences"
  | "briefingIds"
  | "homebrewApprovals"
>;

// 숨겨진 칭호만 쓰는 기록. 숨기거나 취소한 구인은 근거에서 빠져 칭호도 회수된다.
export async function loadHiddenBadgeFacts({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<HiddenBadgeFacts> {
  const visibleGame = and(
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
  );
  // 커넥션을 오래 잡지 않도록 차례로 보낸다. 뱃지 계산이 사용자 요청과 풀을 다투지 않게 한다.
  const draws = await db
    .select({
      gameId: drawResults.gameId,
      roll: drawResults.roll,
      nearMiss: isFirstWaiting,
      lastSeat: isLastSeat,
      contested: isContested,
      picked: sql<boolean>`${drawResults.status} = 'confirmed'`,
      applicants: applicantsOfGame,
      maxPlayers: games.maxPlayers,
      drawnAt: games.drawnAt,
    })
    .from(drawResults)
    .innerJoin(games, eq(games.id, drawResults.gameId))
    .where(
      and(
        visibleGame,
        eq(drawResults.userId, userId),
        isNotNull(drawResults.roll),
        eq(games.recruitMethod, RECRUIT_METHOD.lottery),
        isNotNull(games.drawnAt),
      ),
    );
  const hostedDraws = await db
    .select({
      gameId: games.id,
      applicants: count(drawResults.roll),
      maxPlayers: games.maxPlayers,
      drawnAt: games.drawnAt,
    })
    .from(games)
    .innerJoin(drawResults, eq(drawResults.gameId, games.id))
    .where(
      and(
        visibleGame,
        eq(games.gmId, userId),
        eq(games.recruitMethod, RECRUIT_METHOD.lottery),
        isNotNull(games.drawnAt),
      ),
    )
    .groupBy(games.id);
  const homebrewApprovals = await db
    .select({ at: homebrewRuleApplications.processedAt })
    .from(homebrewRuleApplications)
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.userId, userId),
        eq(homebrewRuleApplications.status, "approved"),
        isNotNull(homebrewRuleApplications.processedAt),
      ),
    )
    .orderBy(asc(homebrewRuleApplications.processedAt));
  const [member] = await db
    .select({ joinedAt: serverMembers.joinedAt })
    .from(serverMembers)
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
  const rush = await db
    .select({ at: userBadges.earnedAt, gameId: userBadges.sourceGameId })
    .from(userBadges)
    .innerJoin(games, eq(games.id, userBadges.sourceGameId))
    .where(
      and(
        visibleGame,
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        eq(userBadges.badgeKey, HIDDEN_LADDER.rush),
      ),
    );
  const fullCasts = await db
    .select({ gameId: games.id, at: max(sessionReviews.createdAt) })
    .from(games)
    .innerJoin(participants, and(eq(participants.gameId, games.id), attendedWhere))
    .innerJoin(
      sessionReviews,
      and(eq(sessionReviews.gameId, games.id), eq(sessionReviews.authorId, participants.userId)),
    )
    .where(
      and(
        eq(games.gmId, userId),
        eq(games.roundCount, 1),
        recognizedGamesWhere,
        countedReviewWhere(serverId),
      ),
    )
    .groupBy(games.id)
    .having(
      sql`${attendedCount} >= ${FULL_CAST_MIN_ATTENDED} and count(distinct ${participants.userId}) = ${attendedCount}`,
    );
  // 다회차는 회차 하나가 세션 하나다. 출석을 확정한 그 회차의 참석자 전원이 그 회차 후기를 남겼는지 본다.
  const attendedInRound = sql<number>`(
    select count(*)::int from ${roundAttendances} as present
    where present.round_id = ${gameRounds.id} and present.attended = true
  )`;
  const roundFullCasts = await db
    .select({ gameId: games.id, at: max(sessionReviews.createdAt) })
    .from(gameRounds)
    .innerJoin(games, eq(games.id, gameRounds.gameId))
    .innerJoin(
      roundAttendances,
      and(eq(roundAttendances.roundId, gameRounds.id), eq(roundAttendances.attended, true)),
    )
    .innerJoin(
      sessionReviews,
      and(
        eq(sessionReviews.roundId, gameRounds.id),
        eq(sessionReviews.authorId, roundAttendances.userId),
      ),
    )
    .where(
      and(
        visibleGame,
        eq(games.gmId, userId),
        gt(games.roundCount, 1),
        isNotNull(gameRounds.attendanceConfirmedAt),
        countedReviewWhere(serverId),
      ),
    )
    .groupBy(gameRounds.id, games.id)
    .having(
      sql`${attendedInRound} >= ${FULL_CAST_MIN_ATTENDED} and count(distinct ${roundAttendances.userId}) = ${attendedInRound}`,
    );
  const absences = await db
    .select({ at: firstRoundStartSql, gameId: games.id })
    .from(participants)
    .innerJoin(games, eq(games.id, participants.gameId))
    .where(
      and(
        visibleGame,
        eq(games.roundCount, 1),
        eq(participants.userId, userId),
        eq(participants.status, "confirmed"),
        eq(participants.absent, true),
        isNull(participants.absenceCancelledAt),
        sql`${firstRoundStartSql} is not null`,
      ),
    );
  // 다회차는 GM이 [불참으로 내보내기]로 뺀 사람만 불참이다. 회차에 빠진 것(attended = false)은 세지 않는다.
  const kickedAbsences = await db
    .select({
      at: sql<Date>`coalesce(${participants.absenceAt}, ${firstRoundStartSql})`.mapWith(
        participants.absenceAt,
      ),
      gameId: games.id,
    })
    .from(participants)
    .innerJoin(games, eq(games.id, participants.gameId))
    .where(
      and(
        visibleGame,
        gt(games.roundCount, 1),
        eq(participants.userId, userId),
        eq(participants.status, "removed"),
        eq(participants.leftReason, "removed"),
        eq(participants.absent, true),
        isNull(participants.absenceCancelledAt),
      ),
    );
  const briefings = await db
    .select({ gameId: games.id })
    .from(games)
    .where(and(visibleGame, eq(games.gmId, userId), eq(games.kind, GAME_KIND.briefing)));
  return {
    absences: [...absences, ...kickedAbsences]
      .filter((absence) => !isNil(absence.at))
      .map((absence) => ({ at: absence.at!, gameId: absence.gameId })),
    briefingIds: briefings.map((briefing) => briefing.gameId),
    homebrewApprovals: homebrewApprovals.map((approval) => ({ at: approval.at!, gameId: null })),
    draws: draws.map((draw) => ({ ...draw, roll: draw.roll!, drawnAt: draw.drawnAt! })),
    hostedDraws: hostedDraws.map((draw) => ({ ...draw, drawnAt: draw.drawnAt! })),
    joinedAt: member?.joinedAt ?? null,
    rush,
    fullCasts: [...fullCasts, ...roundFullCasts]
      .map((cast) => ({ at: cast.at!, gameId: cast.gameId }))
      .toSorted((left, right) => left.at.getTime() - right.at.getTime()),
  };
}
