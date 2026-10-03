import "server-only";
import type { Server } from "@roll-and-call/database";
import { listRosterDiscordIds } from "@roll-and-call/database/games";
import { uniqBy } from "es-toolkit";

import { handleMemberLeft } from "./handle-member-left";
import { hasLeftDiscordGuild } from "./has-left-discord-guild";

// 구인 상세·참여자 관리를 열 때 명단에서 디스코드 서버를 나간 사람을 정리한다. 화면을 막지 않게 after()에서 부른다.
export async function detectRosterDepartures({
  server,
  gameId,
}: {
  server: Server;
  gameId: string;
}) {
  const roster = uniqBy(
    await listRosterDiscordIds({ serverId: server.id, gameId }),
    (member) => member.userId,
  );
  for (const member of roster) {
    if (await hasLeftDiscordGuild({ server, discordId: member.discordId })) {
      await handleMemberLeft({ server, userId: member.userId });
    }
  }
}
