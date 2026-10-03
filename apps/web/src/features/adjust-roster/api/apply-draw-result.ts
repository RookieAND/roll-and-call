"use server";

import {
  countParticipants,
  listRolledApplicantIds,
  markGameDrawn,
  saveDrawResults,
  setDrawRank,
} from "@roll-and-call/database/games";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { evaluateGameBadges, notifyDrawResult } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

// 굴린 값은 이미 정해져 있다. 확정은 그 값으로 확정·대기를 가르고 알림을 보내는 시점일 뿐이다.
export async function applyDrawResult(gameId: string): Promise<ActionResult> {
  return adjustRoster({
    gameId,
    work: async (transaction, game) => {
      if (game.recruitMethod !== RECRUIT_METHOD.lottery) {
        throw new RosterError("추첨으로 모집하는 구인글이 아닙니다.");
      }
      if (game.drawnAt) throw new RosterError("이미 확정한 추첨 결과입니다.");

      const serverId = game.serverId;
      const confirmedCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const rolledIds = await listRolledApplicantIds({ transaction, serverId, gameId });
      if (rolledIds.length === 0) throw new RosterError("아직 추첨하지 않았습니다.");
      const openSeats = Math.max(game.maxPlayers - confirmedCount, 0);

      for (const [index, userId] of rolledIds.entries()) {
        await setDrawRank({
          transaction,
          serverId,
          gameId,
          userId,
          drawRank: index + 1,
          status: index < openSeats ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting,
        });
      }
      await markGameDrawn({ transaction, serverId, gameId });
      await saveDrawResults({ transaction, serverId, gameId });
    },
    // 추첨 칭호(대성공·한 끗 차이·인기 폭발 등)는 추첨을 적용한 직후에 판정한다.
    notify: async (server) => {
      await notifyDrawResult({ server, gameId });
      await evaluateGameBadges({ serverId: server.id, gameId });
    },
  });
}
