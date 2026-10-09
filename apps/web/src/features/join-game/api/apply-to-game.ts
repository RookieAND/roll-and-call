import "server-only";
import { insertParticipant } from "@roll-and-call/database/games";
import { normalizeApplicationNote } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { type Game } from "@/shared/server";

import { evaluateApplication, type Rejection } from "./evaluate-application";

export type Application = {
  game: Game;
  waiting: boolean;
  confirmedCount: number;
  becameFull: boolean;
};

export async function applyToGame({
  serverId,
  gameId,
  userId,
  applicationNote,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  applicationNote?: string;
}): Promise<Application | Rejection> {
  // ponytail: lock the game row so concurrent joins to the same game serialize
  // and can't overfill the last slot. Per-game throughput is tiny, so a row lock is plenty.
  return withTransaction(async (transaction): Promise<Application | Rejection> => {
    const evaluation = await evaluateApplication({ transaction, serverId, gameId, userId });
    if ("error" in evaluation) return evaluation;
    const { game, status, confirmedCount } = evaluation;

    // 신청글 받기 구인만 글을 받는다. 아닌 구인에서는 넘어온 글을 버린다.
    let note: string | null = null;
    if (game.applicationNoteEnabled) {
      note = normalizeApplicationNote(applicationNote);
      if (!note) {
        return {
          error:
            applicationNote === undefined
              ? "이 구인은 신청글이 필요합니다. 사이트에서 신청해 주세요."
              : "신청글은 1자 이상 500자 이하로 써 주세요.",
        };
      }
    }

    const inserted = await insertParticipant({
      transaction,
      serverId,
      gameId,
      userId,
      status,
      waitlistedAt: new Date(),
      applicationNote: note,
    });
    if (!inserted) return { error: "이미 참여 중입니다." };

    const isConfirmed = status === PARTICIPANT_STATUS.confirmed;
    const confirmedAfter = isConfirmed ? confirmedCount + 1 : confirmedCount;
    return {
      game,
      waiting: !isConfirmed,
      confirmedCount: confirmedAfter,
      becameFull: isConfirmed && confirmedAfter === game.maxPlayers,
    };
  });
}
