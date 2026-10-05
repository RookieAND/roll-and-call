"use server";

import { getGuildRoles } from "@roll-and-call/discord";

import { getCurrentServer, requireStaff } from "@/shared/server";

import { UNKNOWN_ROLE_WARNING, unknownRoleIds } from "../model/unknown-role-ids";

// 디스코드에서 역할을 못 읽으면 경고하지 않는다(저장은 어차피 막지 않는다).
export async function checkMessageRoles(text: string): Promise<string | undefined> {
  await requireStaff();
  if (!/<@&\d+>/.test(text)) return undefined;
  const server = await getCurrentServer();
  try {
    const roles = await getGuildRoles({ guildId: server.discordGuildId });
    const missing = unknownRoleIds({ text, guildRoleIds: roles.map((role) => role.id) });
    return missing.length > 0 ? UNKNOWN_ROLE_WARNING : undefined;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}
