import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers, type ProfileKeyword } from "../../../schema";

// 가입 직후 온보딩용. 닉네임·링크는 건드리지 않고 이 서버의 소개·성향만 쓴다.
export async function saveMemberIntro({
  serverId,
  userId,
  bio,
  keywords,
}: {
  serverId: string;
  userId: string;
  bio: string | null;
  keywords: ProfileKeyword[];
}) {
  await db
    .update(serverMembers)
    .set({ bio, keywords })
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
}
