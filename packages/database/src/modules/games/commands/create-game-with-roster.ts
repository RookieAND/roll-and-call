import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants, type NewGame } from "#/schema";

// 대기로 넣는 사람은 넘긴 순서를 지키도록 waitlistedAt을 now + 순번 밀리초로 둔다.
export async function createGameWithRoster({
  transaction,
  serverId,
  columns,
  confirmedUserIds,
  waitingUserIds = [],
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  columns: Omit<NewGame, "serverId">;
  confirmedUserIds: string[];
  waitingUserIds?: string[];
  now?: Date;
}) {
  const work = async (executor: Transaction) => {
    const [created] = await executor
      .insert(games)
      .values({ ...columns, serverId })
      .returning({ id: games.id });
    const gameId = created!.id;
    const rows = [
      ...confirmedUserIds.map((userId) => ({
        serverId,
        gameId,
        userId,
        status: PARTICIPANT_STATUS.confirmed,
      })),
      ...waitingUserIds.map((userId, index) => ({
        serverId,
        gameId,
        userId,
        status: PARTICIPANT_STATUS.waiting,
        waitlistedAt: new Date(now.getTime() + index),
      })),
    ];
    if (rows.length > 0) await executor.insert(participants).values(rows);
    return gameId;
  };
  return transaction ? work(transaction) : db.transaction(work);
}
