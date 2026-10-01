import { db } from "../../client";
import { PARTICIPANT_STATUS } from "../../rules";
import { games, participants, type NewGame } from "../../schema";

export async function createGameWithRoster({
  serverId,
  columns,
  confirmedUserIds,
}: {
  serverId: string;
  columns: Omit<NewGame, "serverId">;
  confirmedUserIds: string[];
}) {
  return db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(games)
      .values({ ...columns, serverId })
      .returning({ id: games.id });
    if (confirmedUserIds.length > 0) {
      await transaction.insert(participants).values(
        confirmedUserIds.map((userId) => ({
          serverId,
          gameId: created!.id,
          userId,
          status: PARTICIPANT_STATUS.confirmed,
        })),
      );
    }
    return created!.id;
  });
}
