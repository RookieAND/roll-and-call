import { eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { servers } from "#/schema";

export interface ServerSettings {
  recruitChannelId: string | null;
  closedChannelId: string | null;
  announceChannelId: string | null;
  staffChannelId: string | null;
  reviewForumChannelId: string | null;
  inviteUrl: string | null;
}

// 서버 설정 화면의 [변경 저장] 한 번이 활동 기록 「서버 설정 변경」 한 건이다. target·reason은 화면이 바뀐 항목으로 만든다.
export async function updateServerSettings({
  serverId,
  settings,
  actor,
  audit,
}: {
  serverId: string;
  settings: ServerSettings;
  actor: Actor;
  audit: { target: string; reason: string };
}) {
  await db.transaction(async (tx) => {
    await tx.update(servers).set(settings).where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: { action: "서버 설정 변경", target: audit.target, reason: audit.reason },
    });
  });
}
