import type { DiscordGuildChannel } from "../guild/get-guild-channels";
import type { DiscordRole } from "../guild/get-guild-roles";
import { computeChannelPermissions } from "./compute-channel-permissions";
import { DISCORD_PERMISSION } from "./discord-permission";

// 아무 역할도 없는 멤버. 이 멤버가 채널을 볼 수 있으면 서버 누구나 볼 수 있는 채널이다.
const NO_ROLE_MEMBER_ID = "0";

export function isEveryoneViewable({
  guildId,
  roles,
  channel,
}: {
  guildId: string;
  roles: DiscordRole[];
  channel: DiscordGuildChannel;
}) {
  const permissions = computeChannelPermissions({
    guildId,
    roles,
    memberId: NO_ROLE_MEMBER_ID,
    memberRoleIds: [],
    channel,
  });
  return (permissions & DISCORD_PERMISSION.viewChannel) !== 0n;
}
