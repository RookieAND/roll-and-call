import { and, eq } from "drizzle-orm";

import { cancelGame } from "#db/modules/games";
import { listSeatOpenedRecipients } from "#db/modules/games";
import { PARTICIPANT_STATUS } from "#db/modules/games/model";
import { ONGOING_ROLE } from "#db/modules/moderation/model/ongoing-role";
import { loadMemberOngoing } from "#db/modules/moderation/queries/load-member-ongoing";
import { createNotifications } from "#db/modules/notifications";
import { GAME_CANCEL_KIND } from "#db/modules/notifications/model";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import type { Transaction } from "#db/modules/transaction";
import { participants, type Game } from "#db/schema";

export interface OngoingChoice {
  sessionId: string;
  action: "keep" | "leave" | "cancel";
}

// 정리 범위(loadMemberOngoing) 밖이 된 구인(그사이 시작·취소)은 건너뛴다. 구인 취소 알림은 cancelGame이 만든다.
// 빠진 자리에 대기자를 올리지 않고(D2), 확정 자리를 비웠으면 대기자에게 빈자리 알림만 보낸다.
export async function applyOngoingChoices({
  transaction,
  serverId,
  userId,
  actorId,
  choices,
}: {
  transaction: Transaction;
  serverId: string;
  userId: string;
  actorId: string;
  choices: OngoingChoice[];
}): Promise<{ cancelledGames: Game[]; leftGameIds: string[] }> {
  const now = new Date();
  const ongoing = await loadMemberOngoing({ executor: transaction, serverId, userId, now });
  const cancelledGames: Game[] = [];
  const leftGameIds: string[] = [];
  for (const choice of choices) {
    const item = ongoing.find((candidate) => candidate.game.id === choice.sessionId);
    if (!item) continue;
    const hosted = item.role === ONGOING_ROLE.gm;
    if (choice.action === "cancel" && hosted) {
      const cancelled = await cancelGame({
        transaction,
        serverId,
        gameId: item.game.id,
        kind: GAME_CANCEL_KIND.staff,
        actorId,
        reason: null,
        now,
      });
      if (cancelled.ok) cancelledGames.push(cancelled.game);
    }
    if (choice.action === "leave" && !hosted) {
      const [left] = await transaction
        .delete(participants)
        .where(
          and(
            eq(participants.serverId, serverId),
            eq(participants.gameId, item.game.id),
            eq(participants.userId, userId),
          ),
        )
        .returning({ status: participants.status });
      if (!left) continue;
      leftGameIds.push(item.game.id);
      if (left.status !== PARTICIPANT_STATUS.confirmed) continue;
      const recipients = await listSeatOpenedRecipients({
        transaction,
        serverId,
        gameId: item.game.id,
        game: item.game,
        now,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId,
        notifications: recipients.map((recipientId) => ({
          userId: recipientId,
          kind: NOTIFICATION_KIND.seatOpened,
          params: { gameId: item.game.id, gameTitle: item.game.title },
        })),
      });
    }
  }
  return { cancelledGames, leftGameIds };
}
