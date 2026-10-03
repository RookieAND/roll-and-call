import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { certSellers } from "#/schema";

export type AddCertSellerResult = { ok: true } | { ok: false; duplicate: true };

// 판매처 목록은 서버마다 따로 둔다.
export async function addCertSeller({
  serverId,
  name,
  actor,
}: {
  serverId: string;
  name: string;
  actor: Actor;
}): Promise<AddCertSellerResult> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(certSellers)
      .values({ serverId, name })
      .onConflictDoNothing()
      .returning({ id: certSellers.id });
    if (!row) return { ok: false, duplicate: true };
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: { action: "판매처 추가", target: name, reason: "전자책 판매처 목록에 추가" },
    });
    return { ok: true };
  });
}
