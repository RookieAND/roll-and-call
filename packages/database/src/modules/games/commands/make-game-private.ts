import { and, eq } from "drizzle-orm";

import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { RECRUIT_METHOD } from "#db/modules/games/model/recruit-method";
import {
  visibilitySwitchBlock,
  type VisibilitySwitchBlock,
} from "#db/modules/games/model/visibility-switch-block";
import { lockGame } from "#db/modules/games/queries/lock-game";
import type { Transaction } from "#db/modules/transaction";
import { games, participants } from "#db/schema";

export type MakeGamePrivateResult =
  | { type: "unchanged" }
  // removedThreadId는 비운 모집 공지 스레드다. 커밋 뒤 디스코드에서 지울 때 쓴다.
  | { type: "changed"; removedThreadId: string | null }
  | { type: "blocked"; reason: VisibilitySwitchBlock }
  | { type: "notFound" };

// 신청·명단 조정과 같은 행 잠금에서 줄을 서서, 신청이 들어오는 중에 비공개로 바뀌지 않게 한다.
// 비공개에서는 모집 항목을 쓰지 않으므로 고정값으로 덮고, 스레드 id를 비워 스레드 의존 발송을 모두 닫는다.
export async function makeGamePrivate({
  transaction,
  serverId,
  gameId,
  gmId,
  now = new Date(),
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  gmId: string;
  now?: Date;
}): Promise<MakeGamePrivateResult> {
  const game = await lockGame({ transaction, serverId, gameId });
  if (!game || game.gmId !== gmId) return { type: "notFound" };
  if (game.visibility === GAME_VISIBILITY.private) return { type: "unchanged" };

  const participantCount = await transaction.$count(
    participants,
    and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)),
  );
  const reason = visibilitySwitchBlock({ game, participantCount, now });
  if (reason) return { type: "blocked", reason };

  await transaction
    .update(games)
    .set({
      visibility: GAME_VISIBILITY.private,
      recruitMethod: RECRUIT_METHOD.firstCome,
      minPlayers: null,
      applicationNoteEnabled: false,
      waitlistEnabled: false,
      endDate: game.confirmedAt ?? game.endDate,
      discordThreadId: null,
    })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  return { type: "changed", removedThreadId: game.discordThreadId };
}
