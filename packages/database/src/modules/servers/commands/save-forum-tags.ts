import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor, AuditChange } from "#db/modules/audit";
import { type ForumTagMap, servers } from "#db/schema";

export async function saveForumTags({
  serverId,
  forumTags,
  actor,
  reason,
  changes,
}: {
  serverId: string;
  forumTags: ForumTagMap | null;
  actor: Actor;
  reason: string;
  changes: AuditChange[];
}) {
  await db.transaction(async (tx) => {
    await tx.update(servers).set({ forumTags }).where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "서버 설정 변경",
        target: "모집 포럼 태그",
        reason,
        after: changes.length > 0 ? { label: "변경됨", changes } : undefined,
      },
    });
  });
}
