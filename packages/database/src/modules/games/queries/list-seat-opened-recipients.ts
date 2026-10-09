import { and, eq } from "drizzle-orm";

import { seatOpenedRecipientIds } from "#/modules/games/model/seat-opened-recipient-ids";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants, type Game } from "#/schema";

// 빈자리 알림(seat_opened)을 받을 사람. 확정 자리를 비운 뒤 같은 트랜잭션에서 부른다. 조건은 seatOpenedRecipientIds.
// 참여자 관리 내보내기(W04)·확정자 참여 취소(W02)·추방과 탈퇴 정리(A1)·제재의 참여 빼기(A3)가 함께 쓴다.
export async function listSeatOpenedRecipients({
  transaction,
  serverId,
  gameId,
  game,
  now = new Date(),
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  game: Pick<
    Game,
    | "confirmedAt"
    | "cancelledAt"
    | "recruitMethod"
    | "drawnAt"
    | "selectionFinishedAt"
    | "maxPlayers"
  >;
  now?: Date;
}): Promise<string[]> {
  const rows = await transaction
    .select({ userId: participants.userId, status: participants.status })
    .from(participants)
    .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
  return seatOpenedRecipientIds({ game, participants: rows, now });
}
