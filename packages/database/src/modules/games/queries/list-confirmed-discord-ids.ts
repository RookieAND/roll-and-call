import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { participants, profiles } from "#/schema";

// 확정 참여자의 디스코드 ID. 세션 종료 안내가 이 사람들을 멘션한다.
export async function listConfirmedDiscordIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const rows = await db
    .select({ discordId: profiles.discordId })
    .from(participants)
    .innerJoin(profiles, eq(profiles.id, participants.userId))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    );
  return rows.map((row) => row.discordId);
}
