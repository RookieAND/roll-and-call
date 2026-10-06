import { eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { type ForumTagMap, servers } from "#/schema";

export async function saveForumTags({
  serverId,
  forumTags,
  actor,
  reason,
}: {
  serverId: string;
  forumTags: ForumTagMap | null;
  actor: Actor;
  reason: string;
}) {
  await db.transaction(async (tx) => {
    await tx.update(servers).set({ forumTags }).where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: { action: "서버 설정 변경", target: "모집 포럼 태그", reason },
    });
  });
}
