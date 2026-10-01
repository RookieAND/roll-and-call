"use server";

import { deleteParticipant } from "@roll-and-call/database/games";

import type { ActionResult } from "@/shared/api";
import { notifyGameLeft } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

export async function removeParticipant({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<ActionResult> {
  return adjustRoster({
    gameId,
    work: async (transaction, game) => {
      const removed = await deleteParticipant({
        transaction,
        serverId: game.serverId,
        gameId,
        userId,
      });
      if (!removed) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
    },
    notify: (server) => notifyGameLeft({ server, gameId, userId, removedByGm: true }),
  });
}
