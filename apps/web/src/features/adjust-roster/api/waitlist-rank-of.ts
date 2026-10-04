import "server-only";
import { listWaitingParticipants } from "@roll-and-call/database/games";
import { compareWaitlistOrder } from "@roll-and-call/database/games/model";
import type { Transaction } from "@roll-and-call/database/transaction";

// 지금 대기 순서(compareWaitlistOrder)에서 그 사람의 순번. 명단 화면의 waitlistRank와 같은 값이다.
export async function waitlistRankOf({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}): Promise<number> {
  const waiting = await listWaitingParticipants({ transaction, serverId, gameId });
  const ordered = waiting.toSorted(compareWaitlistOrder);
  return ordered.findIndex((participant) => participant.userId === userId) + 1;
}
