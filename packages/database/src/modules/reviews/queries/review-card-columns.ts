import { sql } from "drizzle-orm";

import { firstRoundStartSql } from "#db/modules/games/queries/first-round-sql";
import { memberNicknameSql } from "#db/modules/profiles";
import { gameRounds, games, profiles, sessionReviews } from "#db/schema";

// 후기 카드 칸. 작성자 이름은 그 서버 닉네임이라 serverId를 받는다(profiles를 join한 쿼리에서 쓴다).
export function reviewCardColumns(serverId: string) {
  return {
    id: sessionReviews.id,
    gameId: sessionReviews.gameId,
    authorId: sessionReviews.authorId,
    authorRole: sessionReviews.authorRole,
    body: sessionReviews.body,
    spoiler: sessionReviews.spoiler,
    photoUrls: sessionReviews.photoUrls,
    createdAt: sessionReviews.createdAt,
    updatedAt: sessionReviews.updatedAt,
    authorName: memberNicknameSql(serverId),
    authorAvatarUrl: profiles.avatarUrl,
    gameTitle: games.title,
    sessionAt: firstRoundStartSql,
    // 다회차 후기의 회차 번호와 그 회차 시작. 단발은 null이다.
    roundNo: sql<
      number | null
    >`case when ${games.roundCount} > 1 then (select r.round_no from ${gameRounds} r where r.id = ${sessionReviews.roundId}) end`.mapWith(
      (value: unknown) => (value === null ? null : Number(value)),
    ),
    roundStartAt:
      sql<Date | null>`case when ${games.roundCount} > 1 then (select r.start_at from ${gameRounds} r where r.id = ${sessionReviews.roundId}) end`.mapWith(
        (value: string | Date | null) => (value === null ? null : new Date(value)),
      ),
  };
}
