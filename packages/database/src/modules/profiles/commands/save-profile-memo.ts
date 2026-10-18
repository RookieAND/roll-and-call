import { db } from "#db/client";
import { profileMemos } from "#db/schema";

export async function saveProfileMemo({
  serverId,
  ownerId,
  targetId,
  body,
}: {
  serverId: string;
  ownerId: string;
  targetId: string;
  body: string;
}) {
  await db
    .insert(profileMemos)
    .values({ serverId, ownerId, targetId, body })
    .onConflictDoUpdate({
      target: [profileMemos.serverId, profileMemos.ownerId, profileMemos.targetId],
      set: { body, updatedAt: new Date() },
    });
}
