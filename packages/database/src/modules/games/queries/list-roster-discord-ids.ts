import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { games, participants, profiles } from "../../../schema";

// 구인 명단(GM·확정·대기)의 디스코드 ID. 화면을 열 때 디스코드 서버를 나간 사람을 찾는 데 쓴다.
export async function listRosterDiscordIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [gm, players] = await Promise.all([
    db
      .select({ userId: profiles.id, discordId: profiles.discordId })
      .from(games)
      .innerJoin(profiles, eq(profiles.id, games.gmId))
      .where(and(eq(games.serverId, serverId), eq(games.id, gameId))),
    db
      .select({ userId: profiles.id, discordId: profiles.discordId })
      .from(participants)
      .innerJoin(profiles, eq(profiles.id, participants.userId))
      .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId))),
  ]);
  return [...gm, ...players];
}
