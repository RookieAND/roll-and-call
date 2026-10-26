import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { sessionEndAtSql } from "#db/modules/games/queries/session-end-at-sql";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { games, participants } from "#db/schema";

export type EndedGame = { serverId: string; gameId: string };

// 종료 판정 시각이 지난 구인의 확정 참여자에게 후기 작성 웹 알림을 한 번 보낸다.
// 알림 표시를 같은 트랜잭션에서 먼저 가져가므로 크론이 겹쳐 돌아도, 실패해 롤백되면 다음 회차에 다시 집혀도 한 번만 남는다.
// 알림을 마친 구인은 돌려줘서, 종료 전에 확정된 출석이 이제 인정 세션이 된 사람들의 업적을 부르는 쪽이 다시 평가한다.
// 이 시각에 불참으로 처리된 사람은 받지 않는다. 출석 확정 전에는 모두 참석으로 본다.
export async function notifyReviewAvailable({
  now = new Date(),
  limit = 50,
}: { now?: Date; limit?: number } = {}): Promise<{ notified: number; ended: EndedGame[] }> {
  const due = await db
    .select({ id: games.id })
    .from(games)
    .where(
      and(
        isNull(games.reviewNotifiedAt),
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        lte(sessionEndAtSql, sql`${now.toISOString()}::timestamptz`),
      ),
    )
    .orderBy(asc(games.confirmedAt))
    .limit(limit);

  let notified = 0;
  const ended: EndedGame[] = [];
  for (const { id } of due) {
    const count = await db.transaction(async (transaction) => {
      const [game] = await transaction
        .update(games)
        .set({ reviewNotifiedAt: now })
        .where(and(eq(games.id, id), isNull(games.reviewNotifiedAt), isNull(games.cancelledAt)))
        .returning({ id: games.id, serverId: games.serverId, title: games.title });
      if (!game) return null;
      const reviewers = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(
          and(
            eq(participants.gameId, id),
            eq(participants.status, PARTICIPANT_STATUS.confirmed),
            sql`(${participants.absent} = false or ${participants.absenceCancelledAt} is not null)`,
          ),
        );
      return {
        game,
        count: await createNotifications({
          executor: transaction,
          serverId: game.serverId,
          actorId: null,
          notifications: reviewers.map(({ userId }) => ({
            userId,
            kind: NOTIFICATION_KIND.reviewAvailable,
            params: { gameId: game.id, gameTitle: game.title },
          })),
        }),
      };
    });
    if (!count) continue;
    notified += count.count;
    ended.push({ serverId: count.game.serverId, gameId: count.game.id });
  }
  return { notified, ended };
}
