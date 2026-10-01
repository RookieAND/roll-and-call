"use server";

import { randomInt } from "node:crypto";

import {
  closeGameRecruitment,
  countRolledParticipants,
  listParticipantUserIds,
  setDrawRoll,
} from "@roll-and-call/database/games";
import { redirect } from "next/navigation";

import { DIE_FACES, PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import { rollDistinct } from "../model/roll-distinct";
import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

// 추첨은 한 번만 돈다. 직접 확정한 사람은 빼고 신청자마다 1d100을 굴려 둔다.
// 명단과 알림은 GM이 결과 페이지에서 적용할 때(applyDrawResult) 바뀐다. 모집은 굴리는 순간 닫힌다.
export async function drawLottery(gameId: string): Promise<ActionResult> {
  const result = await adjustRoster({
    gameId,
    work: async (transaction, game) => {
      if (game.recruitMethod !== RECRUIT_METHOD.lottery) {
        throw new RosterError("추첨으로 모집하는 구인글이 아닙니다.");
      }
      const serverId = game.serverId;
      const alreadyRolled = await countRolledParticipants({ transaction, serverId, gameId });
      if (game.drawnAt || alreadyRolled > 0) throw new RosterError("이미 추첨을 마쳤습니다.");

      const applicantIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.waiting,
      });
      if (applicantIds.length === 0) throw new RosterError("추첨할 신청자가 없습니다.");
      if (applicantIds.length > DIE_FACES) {
        throw new RosterError(`추첨 신청자는 ${DIE_FACES}명까지만 굴릴 수 있습니다.`);
      }

      const rolls = rollDistinct({
        count: applicantIds.length,
        roll: () => randomInt(1, DIE_FACES + 1),
      });
      for (const [index, userId] of applicantIds.entries()) {
        await setDrawRoll({ transaction, serverId, gameId, userId, drawRoll: rolls[index]! });
      }

      // endDate를 당겨 두면 목록 배지·신청 차단이 기존 기한 기준을 그대로 쓴다.
      const now = new Date();
      if (game.endDate > now) {
        await closeGameRecruitment({ transaction, serverId, gameId, endDate: now });
      }
    },
  });
  if (result.error) return result;
  redirect(`/games/${gameId}/draw`);
}
