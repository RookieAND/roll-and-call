import { and, eq } from "drizzle-orm";
import "server-only";

import { DIE_FACES, isSessionLocked, PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import { GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { db, games, participants, type Game } from "@/shared/server";

export type Application = {
  game: Game;
  waiting: boolean;
  confirmedCount: number;
  becameFull: boolean;
};

type Rejection = ActionResult & { error: string };

export async function applyToGame(
  gameId: string,
  userId: string,
): Promise<Application | Rejection> {
  // ponytail: lock the game row so concurrent joins to the same game serialize
  // and can't overfill the last slot. Per-game throughput is tiny, so a row lock is plenty.
  return db.transaction(async (transaction): Promise<Application | Rejection> => {
    const [game] = await transaction.select().from(games).where(eq(games.id, gameId)).for("update");

    if (!game) return GAME_NOT_FOUND_RESULT;
    if (game.gmId === userId) {
      return { error: "GM은 참여자로 참여할 수 없습니다." };
    }
    // 일시 지정형은 등록 때부터 confirmedAt이 있으므로, 확정 여부는 isSessionLocked로 본다.
    if (isSessionLocked(game)) return { error: "이미 일정이 확정된 게임입니다." };
    if (game.endDate.getTime() <= Date.now()) {
      return { error: "모집이 마감되었습니다." };
    }

    const confirmedCount = await transaction.$count(
      participants,
      and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
    );
    // 추첨은 정원과 무관하게 받고, GM이 참여자 관리에서 확정 인원을 정한다.
    const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
    const isConfirmed = !isLottery && confirmedCount < game.maxPlayers;
    if (!isConfirmed && !isLottery && !game.waitlistEnabled) {
      return { error: "정원이 가득 차 신청할 수 없습니다." };
    }
    if (isLottery) {
      const applicantCount = await transaction.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.waiting)),
      );
      // 1d100 값이 사람마다 달라야 해서 면 수를 넘겨 받지 않는다.
      if (applicantCount >= DIE_FACES) {
        return { error: `추첨 신청은 ${DIE_FACES}명까지만 받을 수 있습니다.` };
      }
    }
    const status = isConfirmed ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting;

    const inserted = await transaction
      .insert(participants)
      .values({ gameId, userId, status })
      .onConflictDoNothing()
      .returning({ userId: participants.userId });

    if (inserted.length === 0) return { error: "이미 참여 중입니다." };

    const confirmedAfter = isConfirmed ? confirmedCount + 1 : confirmedCount;
    return {
      game,
      waiting: !isConfirmed,
      confirmedCount: confirmedAfter,
      becameFull: isConfirmed && confirmedAfter === game.maxPlayers,
    };
  });
}
