import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { certSellers } from "#db/schema";

// 목록에서만 뺀다. 이미 이 판매처로 낸 신청은 적힌 이름을 그대로 둔다.
export async function removeCertSeller({
  serverId,
  id,
  actor,
}: {
  serverId: string;
  id: string;
  actor: Actor;
}) {
  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(certSellers)
      .where(and(eq(certSellers.serverId, serverId), eq(certSellers.id, id)))
      .returning({ name: certSellers.name });
    if (!removed) return;
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "판매처 빼기",
        target: removed.name,
        reason: "전자책 판매처 목록에서 뺌",
        before: { label: "목록에 있음" },
        after: { label: "목록에 없음" },
      },
    });
  });
}
