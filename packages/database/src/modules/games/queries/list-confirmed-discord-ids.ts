import { and, eq, inArray } from "drizzle-orm";

import { db } from "#/client";
import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";
import { participants, profiles } from "#/schema";

// 주어진 상태 참여자의 디스코드 ID. 스레드 안내가 이 사람들을 멘션한다.
export async function listParticipantDiscordIds({
  serverId,
  gameId,
  statuses,
}: {
  serverId: string;
  gameId: string;
  statuses: readonly ParticipantStatus[];
}) {
  const rows = await db
    .select({ discordId: profiles.discordId })
    .from(participants)
    .innerJoin(profiles, eq(profiles.id, participants.userId))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        inArray(participants.status, [...statuses]),
      ),
    );
  return rows.map((row) => row.discordId);
}

// 확정 참여자의 디스코드 ID. 세션 종료·시간 확정 안내가 이 사람들을 멘션한다.
export function listConfirmedDiscordIds(input: { serverId: string; gameId: string }) {
  return listParticipantDiscordIds({ ...input, statuses: [PARTICIPANT_STATUS.confirmed] });
}
