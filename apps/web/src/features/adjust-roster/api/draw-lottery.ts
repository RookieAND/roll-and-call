"use server";

import { randomInt } from "node:crypto";

import { and, eq, isNotNull } from "drizzle-orm";

import { DIE_FACES, PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { games, participants } from "@/shared/server";

import { rollDistinct } from "../model/roll-distinct";
import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

// 추첨은 한 번만 돈다. 직접 확정한 사람은 빼고 신청자마다 1d100을 굴려 둔다.
// 명단과 알림은 GM이 결과 페이지에서 적용할 때(applyDrawResult) 바뀐다. 모집은 굴리는 순간 닫힌다.
export async function drawLottery(gameId: string): Promise<ActionResult> {
  const result = await adjustRoster(gameId, async (transaction, game) => {
    if (game.recruitMethod !== RECRUIT_METHOD.lottery) {
      throw new RosterError("추첨으로 모집하는 구인글이 아닙니다.");
    }
    const alreadyRolled = await transaction.$count(
      participants,
      and(eq(participants.gameId, gameId), isNotNull(participants.drawRoll)),
    );
    if (game.drawnAt || alreadyRolled > 0) throw new RosterError("이미 추첨을 마쳤습니다.");

    const applicants = await transaction
      .select({ userId: participants.userId })
      .from(participants)
      .where(
        and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.waiting)),
      );
    if (applicants.length === 0) throw new RosterError("추첨할 신청자가 없습니다.");
    if (applicants.length > DIE_FACES) {
      throw new RosterError(`추첨 신청자는 ${DIE_FACES}명까지만 굴릴 수 있습니다.`);
    }

    const rolls = rollDistinct(applicants.length, () => randomInt(1, DIE_FACES + 1));
    for (const [index, applicant] of applicants.entries()) {
      await transaction
        .update(participants)
        .set({ drawRoll: rolls[index] })
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, applicant.userId)));
    }

    // endDate를 당겨 두면 목록 배지·신청 차단이 기존 기한 기준을 그대로 쓴다.
    const now = new Date();
    if (game.endDate > now) {
      await transaction.update(games).set({ endDate: now }).where(eq(games.id, gameId));
    }
  });
  return result.error ? result : { redirect: `/games/${gameId}/draw` };
}
