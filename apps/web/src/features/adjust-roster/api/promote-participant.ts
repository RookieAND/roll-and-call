"use server";

import type { Game } from "@roll-and-call/database";
import {
  findParticipantStatus,
  findScheduleConflicts,
  listDatedRounds,
  setParticipantStatus,
} from "@roll-and-call/database/games";
import { RECRUIT_METHOD } from "@roll-and-call/database/games/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { z } from "zod";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { parseActionInput } from "@/shared/api";
import { announceRecruitmentComplete } from "@/shared/server";

import { CAPACITY_ACTION } from "../model/capacity-action";
import type { RosterActionResult } from "../model/roster-action-result";
import { rosterMemberInputSchema } from "../model/roster-member-input";
import { adjustRoster } from "./adjust-roster";
import { announceConfirmed } from "./announce-confirmed";
import { notifyRosterChange } from "./notify-roster-change";
import { rejectSanctioned } from "./reject-sanctioned";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { secureSeats } from "./secure-seats";

const { confirmed, waiting } = PARTICIPANT_STATUS;

const PROMOTE_CONFLICT_MESSAGE = "겹치는 시간대에 다른 세션이 있어 확정으로 올릴 수 없습니다.";

const inputSchema = rosterMemberInputSchema.extend({ raiseCapacity: z.boolean().optional() });

export async function promoteParticipant(
  input: z.input<typeof inputSchema>,
): Promise<RosterActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, userId, raiseCapacity = false } = parsed.data;
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
      const conflicts = await findScheduleConflicts({
        transaction,
        serverId,
        gameId,
        people: [{ userId, role: confirmed }],
        target: await listDatedRounds({ transaction, gameId }),
      });
      if (conflicts.length > 0) throw new RosterError(PROMOTE_CONFLICT_MESSAGE);
      const seats = await secureSeats({
        transaction,
        game,
        timing,
        action: CAPACITY_ACTION.promote,
        addingCount: 1,
        raiseCapacity,
      });
      await setParticipantStatus({ transaction, serverId, gameId, userId, status: confirmed });
      await notifyRosterChange({
        transaction,
        game,
        notifications: [
          {
            userId,
            kind: NOTIFICATION_KIND.participationConfirmed,
            params: { gameId, gameTitle: game.title },
          },
        ],
      });
      promotedIn = game;
      capacityRaised = seats.raised;
      becameFull =
        !timing.started &&
        game.recruitMethod !== RECRUIT_METHOD.selection &&
        seats.confirmedCount + 1 === seats.maxPlayers;
    },
    notify: async (server) => {
      if (!promotedIn) return;
      await announceConfirmed({ server, game: promotedIn, userIds: [userId] });
      if (becameFull) await announceRecruitmentComplete({ server, gameId });
    },
  });
  return result.error ? result : { ...result, capacityRaised };
}
