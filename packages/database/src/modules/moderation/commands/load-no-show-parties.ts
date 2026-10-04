import { and, eq } from "drizzle-orm";

import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, profiles } from "#/schema";

// 불참 기록의 당사자 닉네임·구인 제목·GM. 활동 기록 대상과 알림 받는 사람에 쓴다.
export async function loadNoShowParties({
  tx,
  serverId,
  gameId,
  userId,
}: {
  tx: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const [parties] = await tx
    .select({ nickname: memberNicknameSql(serverId), title: games.title, gmId: games.gmId })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, userId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!parties) throw new Error("불참 기록을 찾을 수 없습니다");
  return parties;
}
