import "server-only";
import {
  getBotUser,
  getGuildChannels,
  getGuildMember,
  getGuildRoles,
} from "@roll-and-call/discord";

import type { GuildSnapshot } from "../model/guild-snapshot";

// 디스코드에서 못 읽으면(봇이 빠짐, 토큰 없음, 응답 없음) null.
export async function loadGuildSnapshot(guildId: string): Promise<GuildSnapshot | null> {
  try {
    const [channels, roles, bot] = await Promise.all([
      getGuildChannels({ guildId }),
      getGuildRoles({ guildId }),
      getBotUser(),
    ]);
    const member = await getGuildMember({ guildId, discordUserId: bot.id });
    if (!member) return null;
    return { guildId, channels, roles, botId: bot.id, botRoleIds: member.roles };
  } catch (error) {
    console.error(error);
    return null;
  }
}
