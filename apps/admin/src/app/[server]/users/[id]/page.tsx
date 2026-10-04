import { isString } from "es-toolkit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import {
  checkDiscordBanFailed,
  checkDiscordUnbanFailed,
  getCurrentServer,
  getKickImpact,
  getUserDetail,
  requireStaff,
} from "@/shared/server";
import {
  ACTIVITY_ROLE,
  kickBlockReason,
  USER_ACTION,
  USER_DETAIL_TAB,
  UserDetailView,
} from "@/views/user-detail";

const TABS = Object.values(USER_DETAIL_TAB);
const ROLES = Object.values(ACTIVITY_ROLE);

export async function generateMetadata({
  params,
}: PageProps<"/[server]/users/[id]">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 유저 상세` : "유저 상세" };
}

export default async function UserDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/users/[id]">) {
  const [{ id }, { tab, role, page, action }, staff, server] = await Promise.all([
    params,
    searchParams,
    requireStaff(),
    getCurrentServer(),
  ]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  const kickBlock = kickBlockReason({
    serverOwner: user.discordId === server.ownerDiscordId,
    staff: user.staffRole !== null,
    self: user.id === staff.id,
  });
  const banned = user.membership === MEMBERSHIP_STATUS.banned;
  // 롤앤콜에서 차단을 푼 뒤 디스코드 해제만 실패했는지는 나간 상태에서만 묻는다(다시 들어왔으면 디스코드 차단이 없다).
  const unbannedLeft = user.unbanned && user.membership === MEMBERSHIP_STATUS.left;
  const [discordBanFailed, discordUnbanFailed, kickImpact] = await Promise.all([
    banned
      ? checkDiscordBanFailed({ guildId: server.discordGuildId, discordId: user.discordId })
      : false,
    unbannedLeft
      ? checkDiscordUnbanFailed({ guildId: server.discordGuildId, discordId: user.discordId })
      : false,
    action === USER_ACTION.kick && !kickBlock && !banned
      ? getKickImpact({ serverId: server.id, userId: user.id })
      : null,
  ]);
  return (
    <UserDetailView
      user={user}
      tab={TABS.find((candidate) => candidate === tab) ?? USER_DETAIL_TAB.activity}
      role={ROLES.find((candidate) => candidate === role) ?? ACTIVITY_ROLE.all}
      page={isString(page) ? page : undefined}
      guildId={server.discordGuildId}
      viewer={{ id: staff.id, owner: staff.role === "owner" }}
      kickBlock={kickBlock}
      discordBanFailed={discordBanFailed}
      discordUnbanFailed={discordUnbanFailed}
      kickImpact={kickImpact}
    />
  );
}
