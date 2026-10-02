import { computeGuildPermissions, DISCORD_PERMISSION } from "@roll-and-call/discord";

import type { GuildSnapshot } from "./guild-snapshot";
import { SETTING_FAIL_REASON, SETTING_TARGET_KIND, type SettingCheck } from "./setting-check";

// 봇이 역할을 부여하려면 역할 관리 권한이 있고, 봇의 가장 높은 역할이 그 역할보다 위여야 한다.
export function checkRoleId({ id, guild }: { id: string; guild: GuildSnapshot }): SettingCheck {
  const role = guild.roles.find((candidate) => candidate.id === id);
  if (!role || role.id === guild.guildId) {
    return { status: "fail", reason: SETTING_FAIL_REASON.roleNotInServer };
  }
  const permissions = computeGuildPermissions({
    guildId: guild.guildId,
    roles: guild.roles,
    memberRoleIds: guild.botRoleIds,
  });
  if (!(permissions & DISCORD_PERMISSION.manageRoles)) {
    return { status: "fail", reason: SETTING_FAIL_REASON.cannotManageRoles };
  }
  const botTop = Math.max(
    0,
    ...guild.roles
      .filter((candidate) => guild.botRoleIds.includes(candidate.id))
      .map((candidate) => candidate.position),
  );
  if (role.position >= botTop) return { status: "fail", reason: SETTING_FAIL_REASON.roleAboveBot };
  return { status: "ok", kind: SETTING_TARGET_KIND.role, name: role.name };
}
