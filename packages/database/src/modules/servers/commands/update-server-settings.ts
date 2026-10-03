import { and, eq, inArray } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { rulebooks, servers } from "#/schema";

export interface ServerSettings {
  recruitChannelId: string | null;
  closedChannelId: string | null;
  announceChannelId: string | null;
  reviewForumChannelId: string | null;
  gmRoleId: string | null;
  inviteUrl: string | null;
}

// 서버 설정 화면의 [변경 저장] 한 번이 활동 기록 「설정 변경」 한 건이다. target·reason은 화면이 바뀐 항목으로 만든다.
// 무료 배포 룰은 이 서버 룰북의 cert_required = false다.
export async function updateServerSettings({
  serverId,
  settings,
  freeRulebookChanges,
  actor,
  audit,
}: {
  serverId: string;
  settings: ServerSettings;
  freeRulebookChanges: { added: string[]; removed: string[] };
  actor: Actor;
  audit: { target: string; reason: string };
}) {
  await db.transaction(async (tx) => {
    await tx.update(servers).set(settings).where(eq(servers.id, serverId));
    const setCertRequired = (ids: string[], certRequired: boolean) =>
      ids.length > 0
        ? tx
            .update(rulebooks)
            .set({ certRequired })
            .where(and(eq(rulebooks.serverId, serverId), inArray(rulebooks.id, ids)))
        : undefined;
    await setCertRequired(freeRulebookChanges.added, false);
    await setCertRequired(freeRulebookChanges.removed, true);
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: { action: "설정 변경", target: audit.target, reason: audit.reason },
    });
  });
}
