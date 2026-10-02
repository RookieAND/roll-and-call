import type { DiscordGuildChannel, DiscordPermissionOverwrite } from "../guild/get-guild-channels";
import type { DiscordRole } from "../guild/get-guild-roles";
import { ALL_PERMISSIONS, computeGuildPermissions } from "./compute-guild-permissions";

const applyOverwrites = (bits: bigint, matching: DiscordPermissionOverwrite[]) => {
  const deny = matching.reduce((all, overwrite) => all | BigInt(overwrite.deny), 0n);
  const allow = matching.reduce((all, overwrite) => all | BigInt(overwrite.allow), 0n);
  return (bits & ~deny) | allow;
};

// 디스코드 문서의 순서대로 @everyone → 역할 → 멤버 덮어쓰기를 적용한다.
export function computeChannelPermissions({
  guildId,
  roles,
  memberId,
  memberRoleIds,
  channel,
}: {
  guildId: string;
  roles: DiscordRole[];
  memberId: string;
  memberRoleIds: string[];
  channel: DiscordGuildChannel;
}) {
  const base = computeGuildPermissions({ guildId, roles, memberRoleIds });
  if (base === ALL_PERMISSIONS) return base;
  const overwrites = channel.permission_overwrites ?? [];
  const everyone = applyOverwrites(
    base,
    overwrites.filter((overwrite) => overwrite.id === guildId),
  );
  const withRoles = applyOverwrites(
    everyone,
    overwrites.filter((overwrite) => overwrite.type === 0 && memberRoleIds.includes(overwrite.id)),
  );
  return applyOverwrites(
    withRoles,
    overwrites.filter((overwrite) => overwrite.type === 1 && overwrite.id === memberId),
  );
}
