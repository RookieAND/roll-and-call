import { roleMentionIds } from "@roll-and-call/database/servers/model";

// 머리 줄에 직접 적은 <@&역할ID> 중 이 서버에 없는 역할. 경고만 하고 저장은 막지 않는다.
export function unknownRoleIds({ text, guildRoleIds }: { text: string; guildRoleIds: string[] }) {
  return roleMentionIds(text).filter((id) => !guildRoleIds.includes(id));
}

export const UNKNOWN_ROLE_WARNING = "이 서버에 없는 역할입니다. 멘션이 울리지 않습니다.";
