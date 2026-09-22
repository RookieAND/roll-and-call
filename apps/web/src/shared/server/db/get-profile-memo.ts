import "server-only";
import { db, profileMemos } from "@roll-and-call/database";
import { and, eq } from "drizzle-orm";

// 쓴 사람만 본다. 상대는 내용도, 메모가 있다는 사실도 볼 수 없다.
export async function getProfileMemo({ ownerId, targetId }: { ownerId: string; targetId: string }) {
  const [memo] = await db
    .select()
    .from(profileMemos)
    .where(and(eq(profileMemos.ownerId, ownerId), eq(profileMemos.targetId, targetId)))
    .limit(1);
  return memo ?? null;
}
