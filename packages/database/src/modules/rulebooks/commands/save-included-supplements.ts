import { and, eq, inArray } from "drizzle-orm";

import type { Executor } from "#db/modules/transaction";
import { rulebooks } from "#db/schema";

// 기본 룰북이 포함하는 서플리먼트를 통째로 바꾼다. 같은 카테고리의 서플리먼트만 받는다.
export async function saveIncludedSupplements({
  executor,
  serverId,
  coreId,
  supplementIds,
}: {
  executor: Executor;
  serverId: string;
  coreId: string;
  supplementIds: string[];
}) {
  await executor
    .update(rulebooks)
    .set({ includedInId: null })
    .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.includedInId, coreId)));
  const [core] = await executor
    .select({ categoryId: rulebooks.categoryId, kind: rulebooks.kind })
    .from(rulebooks)
    .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, coreId)));
  if (core?.kind !== "core" || supplementIds.length === 0) return;
  await executor
    .update(rulebooks)
    .set({ includedInId: coreId })
    .where(
      and(
        eq(rulebooks.serverId, serverId),
        eq(rulebooks.categoryId, core.categoryId),
        eq(rulebooks.kind, "supplement"),
        inArray(rulebooks.id, supplementIds),
      ),
    );
}
