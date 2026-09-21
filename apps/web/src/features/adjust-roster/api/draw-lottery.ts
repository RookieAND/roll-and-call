"use server";

import { and, eq, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { games, notifyDrawResult, participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

// 추첨은 한 번만 돈다. 직접 확정한 사람은 빼고 남은 자리만큼 뽑아, 나머지 순서를 drawRank에 박아 다시 뽑히지 않게 한다.
export async function drawLottery(gameId: string): Promise<ActionResult> {
  return adjustRoster(
    gameId,
    async (transaction, game) => {
      if (game.recruitMethod !== RECRUIT_METHOD.lottery) {
        throw new RosterError("추첨으로 모집하는 구인글이 아닙니다.");
      }
      if (game.drawnAt) throw new RosterError("이미 추첨을 마쳤습니다.");

      const preConfirmedCount = await transaction.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
      );
      const applicants = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(
          and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.waiting)),
        )
        .orderBy(sql`random()`);
      if (applicants.length === 0) throw new RosterError("추첨할 신청자가 없습니다.");
      const openSeats = Math.max(game.maxPlayers - preConfirmedCount, 0);

      for (const [index, applicant] of applicants.entries()) {
        await transaction
          .update(participants)
          .set({
            drawRank: index + 1,
            status: index < openSeats ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting,
          })
          .where(and(eq(participants.gameId, gameId), eq(participants.userId, applicant.userId)));
      }

      // 뽑는 순간 모집이 닫힌다. endDate를 함께 당겨 두면 목록 배지·신청 차단이 기존 기한 기준을 그대로 쓴다.
      const drawnAt = new Date();
      await transaction
        .update(games)
        .set({ drawnAt, endDate: game.endDate < drawnAt ? game.endDate : drawnAt })
        .where(eq(games.id, gameId));
    },
    () => notifyDrawResult(gameId),
  );
}
