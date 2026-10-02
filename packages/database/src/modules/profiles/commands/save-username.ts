import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { profiles } from "../../../schema";

// 닉네임은 계정 전역 값이라 모든 서버에 함께 바뀐다.
export async function saveUsername({ userId, username }: { userId: string; username: string }) {
  await db.update(profiles).set({ username }).where(eq(profiles.id, userId));
}
