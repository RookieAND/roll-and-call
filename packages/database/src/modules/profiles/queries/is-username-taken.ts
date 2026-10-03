import { and, eq, ne } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

// 닉네임은 계정 전역 값이라 서버와 상관없이 다른 계정이 쓰는지 본다.
export async function isUsernameTaken({ userId, username }: { userId: string; username: string }) {
  const [other] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.username, username), ne(profiles.id, userId)))
    .limit(1);
  return Boolean(other);
}
