import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { certifications, games, participants } from "#db/schema";

import { attendedWhere } from "./attended-where";
import { recognizedGamesWhere } from "./recognized-games-where";

// 구인의 참여 조건(룰 플레이 횟수·룰북 인증)에 견줄 내 현황. 룰은 구인의 rule 글자가 같은 인정 세션만 센다.
export async function loadParticipationStanding({
  transaction,
  serverId,
  userId,
  rule,
  rulebookId,
}: {
  transaction?: Transaction;
  serverId: string;
  userId: string;
  rule: string;
  rulebookId: string | null;
}) {
  const executor = transaction ?? db;
  const [plays, certified] = await Promise.all([
    executor
      .select({ value: count() })
      .from(participants)
      .innerJoin(games, eq(games.id, participants.gameId))
      .where(
        and(
          eq(participants.userId, userId),
          attendedWhere,
          eq(games.serverId, serverId),
          eq(games.rule, rule),
          recognizedGamesWhere,
        ),
      )
      .then(([row]) => row?.value ?? 0),
    rulebookId
      ? executor.$count(
          certifications,
          and(
            eq(certifications.serverId, serverId),
            eq(certifications.userId, userId),
            eq(certifications.rulebookId, rulebookId),
            isNull(certifications.revokedAt),
            isNull(certifications.discardedAt),
          ),
        )
      : 0,
  ]);
  return { plays, certified: certified > 0 };
}
