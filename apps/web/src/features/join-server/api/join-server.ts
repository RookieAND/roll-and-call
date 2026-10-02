"use server";

import { getDiscordId } from "@roll-and-call/database/profiles";
import { ensureMembership } from "@roll-and-call/database/servers";
import { isUndefined } from "es-toolkit";
import { redirect } from "next/navigation";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { serverNextPath, serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentUser, isDiscordGuildMember } from "@/shared/server";

import { JOIN_CHECK_FAILED_MESSAGE } from "../model/join-check-failed-message";

export type JoinServerResult = ActionResult & { notGuildMember?: boolean };

export async function joinServer({ next }: { next: string }): Promise<JoinServerResult> {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentUser()]);
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const discordId = await getDiscordId(user.id);
  if (isUndefined(discordId)) return { error: JOIN_CHECK_FAILED_MESSAGE };

  let guildMember: boolean;
  try {
    guildMember = await isDiscordGuildMember(server.discordGuildId, discordId);
  } catch {
    return { error: JOIN_CHECK_FAILED_MESSAGE };
  }
  if (!guildMember) return { notGuildMember: true };

  // 추방된 사람은 디스코드 차단이 실패해 서버에 남아 있어도 들이지 않는다. 화면은 서버 멤버가 아닐 때와 같다.
  const joined = await ensureMembership({ serverId: server.id, userId: user.id });
  if (!joined) return { notGuildMember: true };

  const safeNext = serverNextPath({ slug: server.slug, value: next });
  redirect(
    `${serverPath({ slug: server.slug, path: "/welcome" })}?next=${encodeURIComponent(safeNext)}`,
  );
}
