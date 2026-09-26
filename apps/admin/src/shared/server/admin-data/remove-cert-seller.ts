import "server-only";
import { certSellers, db } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

// 목록에서만 뺀다. 이미 이 판매처로 낸 신청은 적힌 이름을 그대로 둔다.
export async function removeCertSeller(id: string, actor: Actor) {
  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(certSellers)
      .where(eq(certSellers.id, id))
      .returning({ name: certSellers.name });
    if (!removed) return;
    await recordAudit(tx, actor, {
      action: "판매처 빼기",
      target: removed.name,
      reason: "전자책 판매처 목록에서 뺌",
    });
  });
}
