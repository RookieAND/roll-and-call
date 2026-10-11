import { and, eq, inArray } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { serverMessageTexts } from "#/schema";

import {
  defaultReviewTemplate,
  REVIEW_TEMPLATE_KEYS,
  REVIEW_TEMPLATE_LABEL,
  type ReviewTemplatePart,
} from "../model/review-template";

const PARTS = Object.keys(REVIEW_TEMPLATE_KEYS) as ReviewTemplatePart[];

// expectedUpdatedAt은 편집을 시작할 때 읽은 값(두 양식 중 늦은 저장 시각)이다. 그사이 다른 운영진이 저장했으면 conflict로 돌려준다.
// 비우거나 기본 양식과 같게 저장하면 행을 지워 기본으로 되돌린다.
export async function saveReviewTemplate({
  serverId,
  title,
  body,
  expectedUpdatedAt,
  actor,
}: {
  serverId: string;
  title: string;
  body: string;
  expectedUpdatedAt: Date | null;
  actor: Actor;
}): Promise<{ ok: true } | { ok: false; conflict: { by: string | null; at: Date | null } }> {
  const next: Record<ReviewTemplatePart, string> = { title, body };
  return db.transaction(async (tx) => {
    const current = await tx
      .select({
        updatedAt: serverMessageTexts.updatedAt,
        updatedBy: serverMessageTexts.updatedBy,
      })
      .from(serverMessageTexts)
      .where(
        and(
          eq(serverMessageTexts.serverId, serverId),
          inArray(
            serverMessageTexts.textKey,
            PARTS.map((part) => REVIEW_TEMPLATE_KEYS[part]),
          ),
        ),
      )
      .for("update");
    const latest = current.reduce<(typeof current)[number] | undefined>(
      (found, row) => (!found || row.updatedAt > found.updatedAt ? row : found),
      undefined,
    );
    if ((latest?.updatedAt.getTime() ?? null) !== (expectedUpdatedAt?.getTime() ?? null))
      return {
        ok: false,
        conflict: { by: latest?.updatedBy ?? null, at: latest?.updatedAt ?? null },
      } as const;

    for (const part of PARTS) {
      const textKey = REVIEW_TEMPLATE_KEYS[part];
      if (!next[part] || next[part] === defaultReviewTemplate(part)) {
        await tx
          .delete(serverMessageTexts)
          .where(
            and(eq(serverMessageTexts.serverId, serverId), eq(serverMessageTexts.textKey, textKey)),
          );
        continue;
      }
      const values = { body: next[part], updatedBy: actor.id, updatedAt: new Date() };
      await tx
        .insert(serverMessageTexts)
        .values({ serverId, textKey, ...values })
        .onConflictDoUpdate({
          target: [serverMessageTexts.serverId, serverMessageTexts.textKey],
          set: values,
        });
    }
    const changed = PARTS.filter(
      (part) => next[part] && next[part] !== defaultReviewTemplate(part),
    );
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "디스코드 메시지 변경",
        target: REVIEW_TEMPLATE_LABEL,
        reason:
          changed.length > 0
            ? `후기 ${changed.map((part) => (part === "title" ? "제목" : "본문")).join("·")} 양식을 변경`
            : "후기 양식을 기본으로 되돌림",
      },
    });
    return { ok: true } as const;
  });
}
