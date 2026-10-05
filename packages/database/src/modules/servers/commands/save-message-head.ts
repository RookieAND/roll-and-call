import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { serverMessageHeads } from "#/schema";

import { defaultMessageHead, type MessageCaseKey } from "../model/message-heads";

// expectedUpdatedAt은 편집을 시작할 때 읽은 값이다. 그사이 다른 운영진이 저장했으면 conflict로 돌려준다.
// 기본 문구와 같게 저장하면 행을 지워 기본으로 되돌린다.
export async function saveMessageHead({
  serverId,
  key,
  label,
  headLine,
  expectedUpdatedAt,
  actor,
}: {
  serverId: string;
  key: MessageCaseKey;
  label: string;
  headLine: string;
  expectedUpdatedAt: Date | null;
  actor: Actor;
}): Promise<{ ok: true } | { ok: false; conflict: { by: string | null; at: Date | null } }> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ updatedAt: serverMessageHeads.updatedAt, updatedBy: serverMessageHeads.updatedBy })
      .from(serverMessageHeads)
      .where(and(eq(serverMessageHeads.serverId, serverId), eq(serverMessageHeads.caseKey, key)))
      .for("update");
    if ((current?.updatedAt.getTime() ?? null) !== (expectedUpdatedAt?.getTime() ?? null))
      return {
        ok: false,
        conflict: { by: current?.updatedBy ?? null, at: current?.updatedAt ?? null },
      } as const;

    if (headLine === defaultMessageHead(key)) {
      await tx
        .delete(serverMessageHeads)
        .where(and(eq(serverMessageHeads.serverId, serverId), eq(serverMessageHeads.caseKey, key)));
    } else {
      const values = { headLine, updatedBy: actor.id, updatedAt: new Date() };
      await tx
        .insert(serverMessageHeads)
        .values({ serverId, caseKey: key, ...values })
        .onConflictDoUpdate({
          target: [serverMessageHeads.serverId, serverMessageHeads.caseKey],
          set: values,
        });
    }
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "디스코드 메시지 변경",
        target: label,
        reason: headLine ? `머리 줄을 「${headLine}」로 변경` : "머리 줄을 비움",
      },
    });
    return { ok: true } as const;
  });
}
