import "server-only";
import { getGameParticipants } from "@roll-and-call/database/games";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { serverPath } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import { DISCORD_ATTENDANCE_MESSAGE } from "../model/discord-attendance-message";
import { discordAttendanceReply as reply } from "../model/discord-attendance-reply";

// 서명을 확인한 인터랙션의 discordId로 서버·사용자·구인을 찾는다. 못 찾으면 본인에게만 보일 답을 돌려준다.
export async function resolveDiscordAttendance({
  guildId,
  discordId,
  gameId,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
}) {
  const server = await getServerByGuildId(guildId);
  if (!server)
    return { ok: false, reply: reply(DISCORD_ATTENDANCE_MESSAGE.serverNotFound) } as const;

  const userId = await getUserIdByDiscordId(discordId);
  if (!userId)
    return { ok: false, reply: reply(DISCORD_ATTENDANCE_MESSAGE.notRegistered) } as const;
  const membership = await getActiveMembership({ serverId: server.id, userId });
  if (!membership)
    return { ok: false, reply: reply(DISCORD_ATTENDANCE_MESSAGE.notServerMember) } as const;

  const found = await getGameParticipants({ serverId: server.id, gameId });
  if (!found) return { ok: false, reply: reply(DISCORD_ATTENDANCE_MESSAGE.gameNotFound) } as const;

  const webUrl = (path: string) => {
    const origin = siteOrigin();
    return origin ? `${origin}${serverPath({ slug: server.slug, path })}` : null;
  };
  return { ok: true, server, userId, game: found.game, webUrl } as const;
}
