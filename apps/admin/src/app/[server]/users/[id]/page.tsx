import { isString } from "es-toolkit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import {
  checkDiscordBanFailed,
  getCurrentServer,
  getKickImpact,
  getUserDetail,
  requireStaff,
} from "@/shared/server";
import { ACTIVITY_ROLE, USER_ACTION, USER_DETAIL_TAB, UserDetailView } from "@/views/user-detail";

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
  const [{ id }, { tab, role, page, action }, , server] = await Promise.all([
    params,
    searchParams,
    requireStaff(),
    getCurrentServer(),
  ]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  const serverOwner = user.discordId === server.ownerDiscordId;
  const banned = user.membership === MEMBERSHIP_STATUS.banned;
  const [discordBanFailed, kickImpact] = await Promise.all([
    banned
      ? checkDiscordBanFailed({ guildId: server.discordGuildId, discordId: user.discordId })
      : false,
    action === USER_ACTION.kick && !serverOwner && !banned
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
      serverOwner={serverOwner}
      discordBanFailed={discordBanFailed}
      kickImpact={kickImpact}
    />
  );
}
