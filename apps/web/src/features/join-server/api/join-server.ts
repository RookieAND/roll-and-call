"use server";

import { getDiscordId } from "@roll-and-call/database/profiles";
import { ensureMembership } from "@roll-and-call/database/servers";
import { isUndefined } from "es-toolkit";
import { redirect } from "next/navigation";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { safeNextPath, serverPath } from "@/shared/lib";
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

  await ensureMembership({ serverId: server.id, userId: user.id });

  const safeNext = safeNextPath({
    value: next,
    fallback: serverPath({ slug: server.slug, path: "/games" }),
  });
  redirect(
    `${serverPath({ slug: server.slug, path: "/welcome" })}?next=${encodeURIComponent(safeNext)}`,
  );
}
