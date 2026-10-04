import { eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

// 디스코드 로그인 때 받은 계정 이름. 서버 닉네임이 아니다. 가입 기본값의 마지막 대체값으로만 쓴다.
export async function getAccountName(userId: string) {
  const [profile] = await db
    .select({ username: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return profile?.username;
}
