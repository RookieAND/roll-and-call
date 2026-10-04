import "server-only";
import { createNotifications, type NotificationInput } from "@roll-and-call/database/notifications";
import type { Transaction } from "@roll-and-call/database/transaction";

import type { Game } from "@/shared/server";

// 명단 조정 알림은 그 변경과 같은 트랜잭션에서 넣는다. 액션을 부른 사람은 GM이라 actorId는 gmId다.
export async function notifyRosterChange({
  transaction,
  game,
  notifications,
}: {
  transaction: Transaction;
  game: Game;
  notifications: NotificationInput[];
}) {
  await createNotifications({
    executor: transaction,
    serverId: game.serverId,
    actorId: game.gmId,
    notifications,
  });
}
