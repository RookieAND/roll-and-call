import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { games, participants, type NewGame } from "#db/schema";

// 대기로 넣는 사람은 넘긴 순서를 지키도록 waitlistedAt을 now + 순번 밀리초로 둔다. applicationNotes는 사용자 id별로 이어받는 신청글이다.
export async function createGameWithRoster({
  transaction,
  serverId,
  columns,
  confirmedUserIds,
  waitingUserIds = [],
  applicationNotes = new Map(),
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  columns: Omit<NewGame, "serverId">;
  confirmedUserIds: string[];
  waitingUserIds?: string[];
  applicationNotes?: ReadonlyMap<string, string | null>;
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
        applicationNote: applicationNotes.get(userId) ?? null,
      })),
      ...waitingUserIds.map((userId, index) => ({
        serverId,
        gameId,
        userId,
        status: PARTICIPANT_STATUS.waiting,
        waitlistedAt: new Date(now.getTime() + index),
        applicationNote: applicationNotes.get(userId) ?? null,
      })),
    ];
    if (rows.length > 0) await executor.insert(participants).values(rows);
    return gameId;
  };
  return transaction ? work(transaction) : db.transaction(work);
}
