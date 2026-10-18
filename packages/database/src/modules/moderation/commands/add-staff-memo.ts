import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { addedChanges } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { recordAudit } from "#db/modules/audit";
import { memberNicknameSql } from "#db/modules/profiles";
import { profiles, staffMemos } from "#db/schema";

export async function addStaffMemo({
  serverId,
  userId,
  actor,
  body,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  body: string;
}) {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  await db.transaction(async (tx) => {
    await tx.insert(staffMemos).values({ serverId, userId, authorId: actor.id, body });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "운영진 메모",
        target: user.nickname,
        targetUserId: userId,
        reason: body,
        after: { label: "추가됨", changes: addedChanges([["메모", body]]) },
      },
    });
  });
}
