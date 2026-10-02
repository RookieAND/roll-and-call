import {
  computeChannelPermissions,
  DISCORD_CHANNEL_TYPE,
  DISCORD_PERMISSION,
} from "@roll-and-call/discord";

import { checkRoleId } from "./check-role-id";
import type { GuildSnapshot } from "./guild-snapshot";
import { SETTING_CHANNEL_TYPES } from "./setting-channel-types";
import { SETTING_FAIL_REASON, SETTING_TARGET_KIND, type SettingCheck } from "./setting-check";
import type { SettingFieldKey } from "./setting-field";

const CAN_POST = DISCORD_PERMISSION.viewChannel | DISCORD_PERMISSION.sendMessages;

// 봇이 이 ID를 설정 항목으로 쓸 수 있는지 판정한다. 디스코드 호출 없이 미리 읽은 서버 정보만 본다.
export function checkSettingId({
  field,
  id,
  guild,
}: {
  field: SettingFieldKey;
  id: string;
  guild: GuildSnapshot;
}): SettingCheck {
  const channelTypes = SETTING_CHANNEL_TYPES[field];
  if (!channelTypes) return checkRoleId({ id, guild });
  const channel = guild.channels.find((candidate) => candidate.id === id);
  if (!channel) return { status: "fail", reason: SETTING_FAIL_REASON.notInServer };
  if (!channelTypes.includes(channel.type)) {
    return { status: "fail", reason: SETTING_FAIL_REASON.wrongType };
  }
  const permissions = computeChannelPermissions({
    guildId: guild.guildId,
    roles: guild.roles,
    memberId: guild.botId,
    memberRoleIds: guild.botRoleIds,
    channel,
  });
  if ((permissions & CAN_POST) !== CAN_POST) {
    return { status: "fail", reason: SETTING_FAIL_REASON.cannotPost };
  }
  const forum = channel.type === DISCORD_CHANNEL_TYPE.forum;
  const kind = forum ? SETTING_TARGET_KIND.forum : SETTING_TARGET_KIND.channel;
  return { status: "ok", kind, name: channel.name };
}
