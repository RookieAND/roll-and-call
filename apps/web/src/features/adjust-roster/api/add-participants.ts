"use server";

import {
  countParticipants,
  findParticipantStatus,
  insertParticipant,
  setParticipantStatus,
} from "@roll-and-call/database/games";
import { uniq } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { announceRecruitmentComplete, notifyDirectConfirmed } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

const { confirmed } = PARTICIPANT_STATUS;

export async function addParticipants({
  gameId,
  userIds,
}: {
  gameId: string;
  userIds: string[];
}): Promise<ActionResult> {
  if (userIds.length === 0) return { error: "넣을 사람을 골라 주세요." };
  const invitedIds = uniq(userIds);
  let becameFull = false;

  return adjustRoster({
    gameId,
    work: async (transaction, game) => {
      if (userIds.includes(game.gmId)) throw new RosterError("GM은 참여자로 넣을 수 없습니다.");

      const serverId = game.serverId;
      const confirmedCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: confirmed,
      });
      if (confirmedCount + invitedIds.length > game.maxPlayers) {
        throw new RosterError(`남은 자리가 ${game.maxPlayers - confirmedCount}자리뿐입니다.`);
      }

      for (const userId of invitedIds) {
        const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
        if (status === confirmed) throw new RosterError("이미 참여 중인 사람이 있습니다.");
        if (status) {
          await setParticipantStatus({ transaction, serverId, gameId, userId, status: confirmed });
        } else {
          await insertParticipant({ transaction, serverId, gameId, userId, status: confirmed });
        }
      }
      becameFull = confirmedCount + invitedIds.length === game.maxPlayers;
    },
    notify: async (server) => {
      await notifyDirectConfirmed({ server, gameId, userIds: invitedIds });
      if (becameFull) await announceRecruitmentComplete({ server, gameId });
    },
  });
}
