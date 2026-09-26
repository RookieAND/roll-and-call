import "server-only";
import { certSellers, db } from "@roll-and-call/database";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export type AddCertSellerResult = { ok: true } | { ok: false; duplicate: true };

export async function addCertSeller(name: string, actor: Actor): Promise<AddCertSellerResult> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(certSellers)
      .values({ name })
      .onConflictDoNothing()
      .returning({ id: certSellers.id });
    if (!row) return { ok: false, duplicate: true };
    await recordAudit(tx, actor, {
      action: "판매처 추가",
      target: name,
      reason: "전자책 판매처 목록에 추가",
    });
    return { ok: true };
  });
}
