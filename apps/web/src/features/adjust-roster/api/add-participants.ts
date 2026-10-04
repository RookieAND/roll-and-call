"use server";

import {
  findParticipantStatus,
  insertParticipant,
  setParticipantStatus,
} from "@roll-and-call/database/games";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { uniq } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { announceRecruitmentComplete, type Game } from "@/shared/server";

import { CAPACITY_ACTION } from "../model/capacity-action";
import type { RosterActionResult } from "../model/roster-action-result";
import { adjustRoster } from "./adjust-roster";
import { announceConfirmed } from "./announce-confirmed";
import { notifyRosterChange } from "./notify-roster-change";
import { rejectSanctioned } from "./reject-sanctioned";
import { RosterError } from "./roster-error";
import { secureSeats } from "./secure-seats";

const { confirmed } = PARTICIPANT_STATUS;

// 대기자는 확정으로 올리고, 불참으로 내보낸 사람(removed)은 확정으로 되돌리며 불참 표시를 지운다.
export async function addParticipants({
  gameId,
  userIds,
  raiseCapacity = false,
}: {
  gameId: string;
  userIds: string[];
  raiseCapacity?: boolean;
}): Promise<RosterActionResult> {
  if (userIds.length === 0) return { error: "넣을 사람을 골라 주세요." };
  const invitedIds = uniq(userIds);
  let addedTo: Game | null = null;
  let becameFull = false;
  let capacityRaised = false;

  const result = await adjustRoster({
    gameId,
    userIds: invitedIds,
    work: async (transaction, game, timing) => {
      if (invitedIds.includes(game.gmId)) {
        throw new RosterError("GM은 참여자로 넣을 수 없습니다.");
      }

      const serverId = game.serverId;
      const statuses = new Map<string, string | null>();
      for (const userId of invitedIds) {
        const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
        if (status === confirmed) throw new RosterError("이미 참여 중인 사람이 있습니다.");
        statuses.set(userId, status);
      }
      await rejectSanctioned({ transaction, serverId, userIds: invitedIds, timing });
      const seats = await secureSeats({
        transaction,
        game,
        timing,
        action: CAPACITY_ACTION.add,
        addingCount: invitedIds.length,
        raiseCapacity,
      });

      for (const userId of invitedIds) {
        if (statuses.get(userId)) {
          await setParticipantStatus({ transaction, serverId, gameId, userId, status: confirmed });
        } else {
          await insertParticipant({ transaction, serverId, gameId, userId, status: confirmed });
        }
      }
      await notifyRosterChange({
        transaction,
        game,
        notifications: invitedIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.participationConfirmed,
          params: { gameId, gameTitle: game.title },
        })),
      });
      addedTo = game;
      capacityRaised = seats.raised;
      becameFull = !timing.started && seats.confirmedCount + invitedIds.length === seats.maxPlayers;
    },
    notify: async (server) => {
      if (!addedTo) return;
      await announceConfirmed({ server, game: addedTo, userIds: invitedIds });
      if (becameFull) await announceRecruitmentComplete({ server, gameId });
    },
  });
  return result.error ? result : { ...result, capacityRaised };
}
