import { eq } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import { ONGOING_ROLE } from "#/modules/moderation/model/ongoing-role";
import { loadMemberOngoing } from "#/modules/moderation/queries/load-member-ongoing";
import type { Transaction } from "#/modules/transaction/transaction";
import { rulebooks } from "#/schema";

import { revokeCancelRulebookIds } from "../model/revoke-cancel-rulebook-ids";

// 반려로 돌리면 취소되는 구인: 그 유저가 GM이고 그 판본으로 연, 취소되지 않았고 세션이 시작하지 않은 구인.
// 반려로 돌리기 창의 목록과 확정이 같은 범위를 쓴다.
export async function loadRevokeCancelTargets({
  executor = db,
  serverId,
  userId,
  rulebookId,
  now = new Date(),
}: {
  executor?: Transaction | typeof db;
  serverId: string;
  userId: string;
  rulebookId: string;
  now?: Date;
}) {
  const books = await executor
    .select({
      id: rulebooks.id,
      kind: rulebooks.kind,
      categoryId: rulebooks.categoryId,
      edition: rulebooks.edition,
    })
    .from(rulebooks)
    .where(eq(rulebooks.serverId, serverId));
  const rulebook = books.find((book) => book.id === rulebookId);
  if (!rulebook) return [];
  const ids = revokeCancelRulebookIds({ rulebook, rulebooks: books });
  if (ids.length === 0) return [];
  const ongoing = await loadMemberOngoing({ executor, serverId, userId, now });
  return ongoing.filter(
    ({ role, game }) =>
      role === ONGOING_ROLE.gm && !isNull(game.rulebookId) && ids.includes(game.rulebookId),
  );
}
