import { and, count, eq, isNotNull, isNull, max, sql } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeFacts } from "#/modules/badges/model/badge-facts";
import { HIDDEN_LADDER } from "#/modules/badges/model/badge-ladder";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import {
  drawResults,
  games,
  participants,
  serverMembers,
  sessionReviews,
  userBadges,
} from "#/schema";

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
  "draws" | "hostedDraws" | "joinedAt" | "rush" | "fullCasts"
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
    .where(and(eq(games.gmId, userId), recognizedGamesWhere, countedReviewWhere(serverId)))
    .groupBy(games.id)
    .having(
      sql`${attendedCount} >= ${FULL_CAST_MIN_ATTENDED} and count(distinct ${participants.userId}) = ${attendedCount}`,
    );
  return {
    draws: draws.map((draw) => ({ ...draw, roll: draw.roll!, drawnAt: draw.drawnAt! })),
    hostedDraws: hostedDraws.map((draw) => ({ ...draw, drawnAt: draw.drawnAt! })),
    joinedAt: member?.joinedAt ?? null,
    rush,
    fullCasts: fullCasts
      .map((cast) => ({ at: cast.at!, gameId: cast.gameId }))
      .toSorted((left, right) => left.at.getTime() - right.at.getTime()),
  };
}
