import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

// 아직 완료 공지가 없을 때만 저장한다. 동시에 둘이 보냈다면 먼저 저장한 쪽만 true라, 진 쪽이 자기 메시지를 지운다.
export async function saveCompletionMessageId({
  serverId,
  gameId,
  messageId,
}: {
  serverId: string;
  gameId: string;
  messageId: string;
}) {
  const saved = await db
    .update(games)
    .set({ completionMessageId: messageId })
    .where(
      and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.completionMessageId)),
    )
    .returning({ id: games.id });
  return saved.length > 0;
}
