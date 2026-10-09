"use server";

import { findParticipantStatus, setParticipantStatus } from "@roll-and-call/database/games";
import { isAwaitingResult } from "@roll-and-call/database/games/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import { announceRecruitmentComplete, type Game } from "@/shared/server";

import { CAPACITY_ACTION } from "../model/capacity-action";
import type { RosterActionResult } from "../model/roster-action-result";
import { adjustRoster } from "./adjust-roster";
import { announceConfirmed } from "./announce-confirmed";
import { notifyRosterChange } from "./notify-roster-change";
import { rejectSanctioned } from "./reject-sanctioned";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { secureSeats } from "./secure-seats";

const { confirmed, waiting } = PARTICIPANT_STATUS;

export async function promoteParticipant({
  gameId,
  userId,
  raiseCapacity = false,
}: {
  gameId: string;
  userId: string;
  raiseCapacity?: boolean;
}): Promise<RosterActionResult> {
  let promotedIn: Game | null = null;
  let becameFull = false;
  let capacityRaised = false;

  const result = await adjustRoster({
    gameId,
    userIds: [userId],
    work: async (transaction, game, timing) => {
      const serverId = game.serverId;
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (status !== confirmed && status !== waiting) {
        throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      }
      if (status === confirmed) return;

      await rejectSanctioned({ transaction, serverId, userIds: [userId], timing });
      const seats = await secureSeats({
        transaction,
        game,
        timing,
        action: CAPACITY_ACTION.promote,
        addingCount: 1,
        raiseCapacity,
      });
      await setParticipantStatus({ transaction, serverId, gameId, userId, status: confirmed });
      // 선발 전 확정은 선발을 마칠 때 확정자 전원에게 한 번 알린다.
      const deferred = isAwaitingResult(game) && game.recruitMethod === RECRUIT_METHOD.selection;
      await notifyRosterChange({
        transaction,
        game,
        notifications: deferred
          ? []
          : [
              {
                userId,
                kind: NOTIFICATION_KIND.participationConfirmed,
                params: { gameId, gameTitle: game.title },
              },
            ],
      });
      promotedIn = deferred ? null : game;
      capacityRaised = seats.raised;
      becameFull = !timing.started && seats.confirmedCount + 1 === seats.maxPlayers;
    },
    notify: async (server) => {
      if (!promotedIn) return;
      await announceConfirmed({ server, game: promotedIn, userIds: [userId] });
      if (becameFull) await announceRecruitmentComplete({ server, gameId });
    },
  });
  return result.error ? result : { ...result, capacityRaised };
}
