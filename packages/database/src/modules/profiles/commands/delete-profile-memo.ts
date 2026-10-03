import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { profileMemos } from "#/schema";

export async function deleteProfileMemo({
  serverId,
  ownerId,
  targetId,
}: {
  serverId: string;
  ownerId: string;
  targetId: string;
}) {
  await db
    .delete(profileMemos)
    .where(
      and(
        eq(profileMemos.serverId, serverId),
        eq(profileMemos.ownerId, ownerId),
        eq(profileMemos.targetId, targetId),
      ),
    );
}
