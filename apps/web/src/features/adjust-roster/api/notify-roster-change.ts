import "server-only";
import type { Game } from "@roll-and-call/database";
import { isSelectionDraft } from "@roll-and-call/database/games/model";
import { createNotifications, type NotificationInput } from "@roll-and-call/database/notifications";
import type { Transaction } from "@roll-and-call/database/transaction";

// 명단 조정 알림은 그 변경과 같은 트랜잭션에서 넣는다. 액션을 부른 사람은 GM이라 actorId는 gmId다.
// 선발을 마치기 전 명단은 초안이라 알리지 않는다. 결과는 [선발 마치기]가 한 번에 보낸다.
export async function notifyRosterChange({
  transaction,
  game,
  notifications,
}: {
  transaction: Transaction;
  game: Game;
  notifications: NotificationInput[];
}) {
  if (isSelectionDraft(game)) return;
  await createNotifications({
    executor: transaction,
    serverId: game.serverId,
    actorId: game.gmId,
    notifications,
  });
}
