import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { serverMessageTexts } from "#/schema";

import { defaultMessageText, type MessageTextKey } from "../model/message-texts";

// expectedUpdatedAt은 편집을 시작할 때 읽은 값이다. 그사이 다른 운영진이 저장했으면 conflict로 돌려준다.
// 비우거나 기본 문장과 같게 저장하면 행을 지워 기본으로 되돌린다.
export async function saveMessageText({
  serverId,
  key,
  label,
  body,
  expectedUpdatedAt,
  actor,
}: {
  serverId: string;
  key: MessageTextKey;
  label: string;
  body: string;
  expectedUpdatedAt: Date | null;
  actor: Actor;
}): Promise<{ ok: true } | { ok: false; conflict: { by: string | null; at: Date | null } }> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({
        updatedAt: serverMessageTexts.updatedAt,
        updatedBy: serverMessageTexts.updatedBy,
      })
      .from(serverMessageTexts)
      .where(and(eq(serverMessageTexts.serverId, serverId), eq(serverMessageTexts.textKey, key)))
      .for("update");
    if ((current?.updatedAt.getTime() ?? null) !== (expectedUpdatedAt?.getTime() ?? null))
      return {
        ok: false,
        conflict: { by: current?.updatedBy ?? null, at: current?.updatedAt ?? null },
      } as const;

    if (!body || body === defaultMessageText(key)) {
      await tx
        .delete(serverMessageTexts)
        .where(and(eq(serverMessageTexts.serverId, serverId), eq(serverMessageTexts.textKey, key)));
    } else {
      const values = { body, updatedBy: actor.id, updatedAt: new Date() };
      await tx
        .insert(serverMessageTexts)
        .values({ serverId, textKey: key, ...values })
        .onConflictDoUpdate({
          target: [serverMessageTexts.serverId, serverMessageTexts.textKey],
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
        reason:
          body && body !== defaultMessageText(key)
            ? `설명 문장을 「${body}」로 변경`
            : "설명 문장을 기본으로 되돌림",
      },
    });
    return { ok: true } as const;
  });
}
