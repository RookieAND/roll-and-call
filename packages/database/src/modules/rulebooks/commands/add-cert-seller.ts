import { db } from "../../../client";
import { certSellers } from "../../../schema";
import { recordAudit } from "../../moderation/commands/record-audit";
import type { Actor } from "../../moderation/model/types";

export type AddCertSellerResult = { ok: true } | { ok: false; duplicate: true };

// 판매처 목록은 모든 서버가 함께 쓴다. 활동 기록만 조치한 서버에 남긴다.
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
      .values({ name })
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
