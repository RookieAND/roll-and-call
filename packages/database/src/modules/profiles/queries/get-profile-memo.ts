import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { profileMemos } from "../../../schema";

// 쓴 사람만 본다. 상대는 내용도, 메모가 있다는 사실도 볼 수 없다.
export async function getProfileMemo({
  serverId,
  ownerId,
  targetId,
}: {
  serverId: string;
  ownerId: string;
  targetId: string;
}) {
  const [memo] = await db
    .select()
    .from(profileMemos)
    .where(
      and(
        eq(profileMemos.serverId, serverId),
        eq(profileMemos.ownerId, ownerId),
        eq(profileMemos.targetId, targetId),
      ),
    )
    .limit(1);
  return memo ?? null;
}
