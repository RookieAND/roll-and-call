import { eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

import { memberNicknameSql } from "./member-nickname-sql";

// 운영진 알림에 쓸 신청자 정보: 그 서버 닉네임 + 디스코드 ID·아바타. 계정이 없으면 undefined.
export async function getMemberIdentity({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const [row] = await db
    .select({
      nickname: memberNicknameSql(serverId),
      discordId: profiles.discordId,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return row;
}
