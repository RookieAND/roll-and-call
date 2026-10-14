import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { supplementNameKey } from "#/modules/games/model/supplement-name-key";
import type { Transaction } from "#/modules/transaction/transaction";
import { rulebookRequestGames, rulebookRequests } from "#/schema";

// 구인에 직접 입력한 서플리먼트마다 룰북 추가 요청을 붙인다. 같은 분류·판본에 같은 이름의 대기 요청이 있으면 그 요청에 묶고,
// 반려된 이름이면 다시 요청하지 않는다. 구인에서 지운 이름의 연결은 빼고, 남은 구인이 없는 자동 요청은 트리거가 지운다.
// 룰의 분류를 모르면(룰북이 숨겨진 옛 구인) 새 요청은 만들지 않고 지운 이름의 연결만 정리한다.
export async function syncGameSupplementRequests({
  transaction,
  serverId,
  gameId,
  gmId,
  categoryId,
  edition,
  names,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  gmId: string;
  categoryId: string | null;
  edition: string;
  names: string[];
}) {
  const candidates = categoryId
    ? await transaction
        .select({
          id: rulebookRequests.id,
          name: rulebookRequests.name,
          outcome: rulebookRequests.outcome,
        })
        .from(rulebookRequests)
        .where(
          and(
            eq(rulebookRequests.serverId, serverId),
            eq(rulebookRequests.categoryId, categoryId),
            eq(rulebookRequests.edition, edition),
            or(isNull(rulebookRequests.outcome), eq(rulebookRequests.outcome, "rejected")),
          ),
        )
    : [];
  const linked = await transaction
    .select({ requestId: rulebookRequestGames.requestId, name: rulebookRequests.name })
    .from(rulebookRequestGames)
    .innerJoin(rulebookRequests, eq(rulebookRequests.id, rulebookRequestGames.requestId))
    .where(
      and(eq(rulebookRequestGames.serverId, serverId), eq(rulebookRequestGames.gameId, gameId)),
    );

  const keys = new Set(names.map(supplementNameKey));
  const keepRequestIds = new Set<string>();
  for (const name of names) {
    const key = supplementNameKey(name);
    const current = linked.find((link) => supplementNameKey(link.name) === key);
    if (current) {
      keepRequestIds.add(current.requestId);
      continue;
    }
    if (!categoryId) continue;
    const matches = candidates.filter((candidate) => supplementNameKey(candidate.name) === key);
    if (matches.some((candidate) => candidate.outcome === "rejected")) continue;
    const pending = matches.find((candidate) => candidate.outcome === null);
    const requestId = pending?.id ?? (await createRequest({ name, shelfId: categoryId }));
    keepRequestIds.add(requestId);
    await transaction
      .insert(rulebookRequestGames)
      .values({ serverId, requestId, gameId })
      .onConflictDoNothing();
  }

  const stale = linked
    .filter(
      (link) => !keys.has(supplementNameKey(link.name)) && !keepRequestIds.has(link.requestId),
    )
    .map((link) => link.requestId);
  if (stale.length > 0) {
    await transaction
      .delete(rulebookRequestGames)
      .where(
        and(
          eq(rulebookRequestGames.gameId, gameId),
          inArray(rulebookRequestGames.requestId, stale),
        ),
      );
  }

  async function createRequest({ name, shelfId }: { name: string; shelfId: string }) {
    const [created] = await transaction
      .insert(rulebookRequests)
      .values({
        serverId,
        userId: gmId,
        name,
        edition,
        kind: "supplement",
        categoryId: shelfId,
        source: "game",
        note: "",
      })
      .returning({ id: rulebookRequests.id });
    candidates.push({ id: created!.id, name, outcome: null });
    return created!.id;
  }
}
