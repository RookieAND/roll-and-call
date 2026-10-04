import { and, eq, isNull, not, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { games, participants, sessionReviews } from "#/schema";

import { reviewAuthorAbsentSql } from "./review-author-absent-sql";

// 바깥 쿼리가 games·participants를 조인해도 겹치지 않게 별칭을 쓴다. sql 안에서 별칭 표는 이름만 찍히므로 from에는 원래 표를 적는다.
const reviewGame = alias(games, "review_game");
const reviewParticipant = alias(participants, "review_participant");

// 숨김·제거·보류(작성자가 지금 불참)가 아닌 후기만 다른 사람에게 보인다.
// 운영진이 숨긴 구인의 후기는 그 구인의 GM·확정 참여자에게만 보인다.
export function publicReviewsWhere({
  serverId,
  viewerId,
}: {
  serverId: string;
  viewerId: string | null;
}) {
  const viewerTakesPart = viewerId
    ? sql`or ${reviewGame.gmId} = ${viewerId} or exists (
        select 1 from ${participants} ${reviewParticipant}
        where ${reviewParticipant.serverId} = ${reviewGame.serverId}
          and ${reviewParticipant.gameId} = ${reviewGame.id}
          and ${reviewParticipant.userId} = ${viewerId}
          and ${reviewParticipant.status} = ${PARTICIPANT_STATUS.confirmed}
      )`
    : sql``;
  return and(
    eq(sessionReviews.serverId, serverId),
    isNull(sessionReviews.removedAt),
    isNull(sessionReviews.hiddenAt),
    not(reviewAuthorAbsentSql),
    sql`exists (
      select 1 from ${games} ${reviewGame}
      where ${reviewGame.serverId} = ${sessionReviews.serverId}
        and ${reviewGame.id} = ${sessionReviews.gameId}
        and (${reviewGame.hiddenAt} is null ${viewerTakesPart})
    )`,
  );
}
