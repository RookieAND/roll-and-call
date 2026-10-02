import type { DiscordRole } from "../guild/get-guild-roles";
import { DISCORD_PERMISSION } from "./discord-permission";

export const ALL_PERMISSIONS = ~0n;

// 서버 전체에서 멤버가 가진 권한. @everyone 역할의 id는 서버 id와 같다.
export function computeGuildPermissions({
  guildId,
  roles,
  memberRoleIds,
}: {
  guildId: string;
  roles: DiscordRole[];
  memberRoleIds: string[];
}) {
  const permissions = roles
    .filter((role) => role.id === guildId || memberRoleIds.includes(role.id))
    .reduce((bits, role) => bits | BigInt(role.permissions), 0n);
  return permissions & DISCORD_PERMISSION.administrator ? ALL_PERMISSIONS : permissions;
}
