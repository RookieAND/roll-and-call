"use server";

import { and, asc, eq, isNotNull } from "drizzle-orm";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { games, notifyDrawResult, participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

// 굴린 값은 이미 정해져 있다. 확정은 그 값으로 확정·대기를 가르고 알림을 보내는 시점일 뿐이다.
export async function applyDrawResult(gameId: string): Promise<ActionResult> {
  return adjustRoster(
    gameId,
    async (transaction, game) => {
      if (game.recruitMethod !== RECRUIT_METHOD.lottery) {
        throw new RosterError("추첨으로 모집하는 구인글이 아닙니다.");
      }
      if (game.drawnAt) throw new RosterError("이미 확정한 추첨 결과입니다.");

      const confirmedCount = await transaction.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
      );
      const rolled = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(
          and(
            eq(participants.gameId, gameId),
            eq(participants.status, PARTICIPANT_STATUS.waiting),
            isNotNull(participants.drawRoll),
          ),
        )
        .orderBy(asc(participants.drawRoll), asc(participants.joinedAt));
      if (rolled.length === 0) throw new RosterError("아직 추첨하지 않았습니다.");
      const openSeats = Math.max(game.maxPlayers - confirmedCount, 0);

      for (const [index, participant] of rolled.entries()) {
        await transaction
          .update(participants)
          .set({
            drawRank: index + 1,
            status: index < openSeats ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting,
          })
          .where(and(eq(participants.gameId, gameId), eq(participants.userId, participant.userId)));
      }
      await transaction.update(games).set({ drawnAt: new Date() }).where(eq(games.id, gameId));
    },
    () => notifyDrawResult(gameId),
  );
}
