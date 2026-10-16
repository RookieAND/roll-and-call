import type { Server } from "@roll-and-call/database";
import { isPlatformAdmin } from "@roll-and-call/database/moderation";
import { countActiveMembers, getMemberRole } from "@roll-and-call/database/servers";

import { getProfile, listMemberServers } from "@/shared/server";
import { DesktopNav } from "@/shared/ui";

import { DesktopNavSignOut } from "./desktop-nav-sign-out";
import { memberRoleLabel } from "./member-role-label";

interface DesktopNavLoaderProps {
  server: Pick<Server, "id" | "slug" | "name" | "icon">;
  userId: string | undefined;
}

// 좌측 내비의 서버 전환·멤버 수·내 프로필. 본문 렌더를 막지 않도록 Suspense 안에서 읽는다.
export async function DesktopNavLoader({ server, userId }: DesktopNavLoaderProps) {
  const [memberCount, servers, profile, role] = await Promise.all([
    countActiveMembers(server.id),
    userId ? listMemberServers(userId) : [],
    userId ? getProfile(server.id, userId) : undefined,
    userId ? getMemberRole({ serverId: server.id, userId }) : null,
  ]);
  return (
    <DesktopNav
      current={{ slug: server.slug, name: server.name, icon: server.icon }}
      servers={servers.map(({ slug, name, icon }) => ({ slug, name, icon }))}
      memberCount={memberCount}
      profile={
        profile && {
          name: profile.username,
          avatar: profile.avatarUrl,
          role: memberRoleLabel({ isPlatformAdmin: isPlatformAdmin(profile.discordId), role }),
        }
      }
      signOut={profile && <DesktopNavSignOut />}
    />
  );
}
