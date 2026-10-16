import type { Server } from "@roll-and-call/database";
import { countActiveMembers } from "@roll-and-call/database/servers";

import { getProfile, listMemberServers } from "@/shared/server";
import { DesktopNav } from "@/shared/ui";

interface DesktopNavLoaderProps {
  server: Pick<Server, "id" | "slug" | "name" | "icon">;
  userId: string | undefined;
}

// 좌측 내비의 서버 전환·멤버 수·내 프로필. 본문 렌더를 막지 않도록 Suspense 안에서 읽는다.
export async function DesktopNavLoader({ server, userId }: DesktopNavLoaderProps) {
  const [memberCount, servers, profile] = await Promise.all([
    countActiveMembers(server.id),
    userId ? listMemberServers(userId) : [],
    userId ? getProfile(server.id, userId) : undefined,
  ]);
  return (
    <DesktopNav
      current={{ slug: server.slug, name: server.name, icon: server.icon }}
      servers={servers.map(({ slug, name, icon }) => ({ slug, name, icon }))}
      memberCount={memberCount}
      profile={profile && { name: profile.username, avatar: profile.avatarUrl }}
    />
  );
}
