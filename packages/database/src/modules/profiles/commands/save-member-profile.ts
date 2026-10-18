import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { serverMembers, type ProfileKeyword, type ProfileLink } from "#db/schema";

import { saveMemberNickname } from "./save-member-nickname";

// 닉네임·소개·플레이 스타일·배너·강조색·성향·링크 모두 이 서버의 프로필(server_members)에 쓴다. 닉네임이 겹치면 아무것도 저장하지 않는다.
export async function saveMemberProfile({
  serverId,
  userId,
  nickname,
  bio,
  playStyle,
  bannerUrl,
  accentColor,
  keywords,
  links,
}: {
  serverId: string;
  userId: string;
  nickname: string;
  bio: string | null;
  playStyle: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  keywords: ProfileKeyword[];
  links: ProfileLink[];
}) {
  return db.transaction(async (transaction) => {
    const saved = await saveMemberNickname({ transaction, serverId, userId, nickname });
    if (!saved.ok) return saved;
    await transaction
      .update(serverMembers)
      .set({ bio, playStyle, bannerUrl, accentColor, keywords, links })
      .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
    return saved;
  });
}
