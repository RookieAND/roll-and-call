import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { privateNoticeWindows } from "#db/modules/games/model/private-notice-window";
import { firstRoundStartSql } from "#db/modules/games/queries/first-round-sql";
import { createNotifications } from "#db/modules/notifications";
import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "#db/modules/notifications/model/notification-kind";
import type { Transaction } from "#db/modules/transaction";
import { games, participants } from "#db/schema";

import { claimPrivateRounds, type DuePrivateRound } from "./claim-private-rounds";

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
    // 다회차는 회차마다 같은 알림을 회차 번호와 함께 보낸다.
    const remindedRounds = await claimPrivateRounds({
      transaction,
      mark: "notifiedAt",
      window: windows.reminder,
      now,
    });
    const startedRounds = await claimPrivateRounds({
      transaction,
      mark: "startNotifiedAt",
      window: windows.start,
      now,
    });
    const recipients = await confirmedByGame({
      transaction,
      gameIds: [
        ...[...reminded, ...started].map((game) => game.id),
        ...[...remindedRounds, ...startedRounds].map((round) => round.gameId),
      ],
    });

    const byServer = new Map<string, NotificationInput[]>();
    const add = (serverId: string, notification: NotificationInput) =>
      byServer.set(serverId, [...(byServer.get(serverId) ?? []), notification]);
    const usersOf = (game: Pick<DueGame, "id" | "gmId">) => [
      game.gmId,
      ...(recipients.get(game.id) ?? []).filter((userId) => userId !== game.gmId),
    ];
    const roundGame = (round: DuePrivateRound) => ({ id: round.gameId, gmId: round.gmId });
    for (const round of remindedRounds) {
      for (const userId of usersOf(roundGame(round))) {
        add(round.serverId, {
          userId,
          kind: NOTIFICATION_KIND.sessionReminder,
          params: { gameId: round.gameId, gameTitle: round.title, roundNo: round.roundNo },
        });
      }
    }
    for (const round of startedRounds) {
      for (const userId of usersOf(roundGame(round))) {
        add(round.serverId, {
          userId,
          kind: NOTIFICATION_KIND.sessionStarted,
          params: {
            gameId: round.gameId,
            gameTitle: round.title,
            isGm: userId === round.gmId,
            roundNo: round.roundNo,
          },
        });
      }
    }
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
    return {
      notified,
      reminded: reminded.length,
      started: started.length,
      // Canvas 시작 이벤트는 구인에 한 번이라 다회차는 1회차만 넣는다.
      startedGameIds: [
        ...started.map((game) => game.id),
        ...startedRounds.filter((round) => round.roundNo === 1).map((round) => round.gameId),
      ],
    };
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
        eq(games.roundCount, 1),
        isNull(games[mark]),
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        sql`${firstRoundStartSql} > ${window.from.toISOString()}::timestamptz`,
        sql`${firstRoundStartSql} <= ${window.to.toISOString()}::timestamptz`,
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
