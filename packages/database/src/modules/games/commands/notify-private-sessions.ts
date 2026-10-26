import { and, eq, gt, inArray, isNull, lte } from "drizzle-orm";

import { db } from "#db/client";
import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { privateNoticeWindows } from "#db/modules/games/model/private-notice-window";
import { createNotifications } from "#db/modules/notifications";
import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "#db/modules/notifications/model/notification-kind";
import type { Transaction } from "#db/modules/transaction";
import { games, participants } from "#db/schema";

type DueGame = { id: string; serverId: string; gmId: string; title: string };

// 비공개 구인은 디스코드 스레드가 없어 1시간 전과 시작 안내를 GM과 확정 참여자에게 웹 알림으로 보낸다.
// 알림 표시(notified_at·start_notified_at)를 같은 트랜잭션에서 먼저 가져가므로 크론이 겹쳐도, 롤백돼 다시 집혀도 한 번만 남는다.
// 쿼리는 종류마다 구인 전체를 한 번씩 읽고 참여자도 한 번에 읽는다. 구인마다 도는 쿼리는 없다.
export async function notifyPrivateSessions({ now = new Date() }: { now?: Date } = {}) {
  const windows = privateNoticeWindows(now);
  return db.transaction(async (transaction) => {
    const reminded = await claim({
      transaction,
      mark: "notifiedAt",
      window: windows.reminder,
      now,
    });
    const started = await claim({
      transaction,
      mark: "startNotifiedAt",
      window: windows.start,
      now,
    });
    const recipients = await confirmedByGame({
      transaction,
      gameIds: [...reminded, ...started].map((game) => game.id),
    });

    const byServer = new Map<string, NotificationInput[]>();
    const add = (serverId: string, notification: NotificationInput) =>
      byServer.set(serverId, [...(byServer.get(serverId) ?? []), notification]);
    const usersOf = (game: DueGame) => [
      game.gmId,
      ...(recipients.get(game.id) ?? []).filter((userId) => userId !== game.gmId),
    ];
    for (const game of reminded) {
      for (const userId of usersOf(game)) {
        add(game.serverId, {
          userId,
          kind: NOTIFICATION_KIND.sessionReminder,
          params: { gameId: game.id, gameTitle: game.title },
        });
      }
    }
    for (const game of started) {
      for (const userId of usersOf(game)) {
        add(game.serverId, {
          userId,
          kind: NOTIFICATION_KIND.sessionStarted,
          params: { gameId: game.id, gameTitle: game.title, isGm: userId === game.gmId },
        });
      }
    }

    let notified = 0;
    for (const [serverId, notifications] of byServer) {
      notified += await createNotifications({
        executor: transaction,
        serverId,
        actorId: null,
        notifications,
      });
    }
    return { notified, reminded: reminded.length, started: started.length };
  });
}

async function claim({
  transaction,
  mark,
  window,
  now,
}: {
  transaction: Transaction;
  mark: "notifiedAt" | "startNotifiedAt";
  window: { from: Date; to: Date };
  now: Date;
}): Promise<DueGame[]> {
  return transaction
    .update(games)
    .set({ [mark]: now })
    .where(
      and(
        eq(games.visibility, GAME_VISIBILITY.private),
        isNull(games[mark]),
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        gt(games.confirmedAt, window.from),
        lte(games.confirmedAt, window.to),
      ),
    )
    .returning({ id: games.id, serverId: games.serverId, gmId: games.gmId, title: games.title });
}

async function confirmedByGame({
  transaction,
  gameIds,
}: {
  transaction: Transaction;
  gameIds: string[];
}) {
  const byGame = new Map<string, string[]>();
  if (gameIds.length === 0) return byGame;
  const rows = await transaction
    .select({ gameId: participants.gameId, userId: participants.userId })
    .from(participants)
    .where(
      and(
        inArray(participants.gameId, gameIds),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    );
  for (const { gameId, userId } of rows)
    byGame.set(gameId, [...(byGame.get(gameId) ?? []), userId]);
  return byGame;
}
