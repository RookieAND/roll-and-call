"use server";

import { listParticipantUserIds, lockGame, setSessionEndedAt } from "@roll-and-call/database/games";
import { END_SESSION_BLOCK, endSessionBlock } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { after } from "next/server";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { GAME_NOT_FOUND_RESULT } from "@/shared/api";
import {
  getActingMember,
  notifyGameEnded,
  notMemberError,
  revalidateGamePaths,
} from "@/shared/server";

import { END_SESSION_MESSAGES } from "../model/end-session-messages";
import type { EndSessionResult } from "../model/end-session-result";

const TO_ATTENDANCE_BLOCKS: readonly string[] = [
  END_SESSION_BLOCK.alreadyEnded,
  END_SESSION_BLOCK.sessionOver,
];

export async function endSession(gameId: string): Promise<EndSessionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const serverId = server.id;

  const result = await withTransaction(async (transaction): Promise<EndSessionResult> => {
    const game = await lockGame({ transaction, serverId, gameId });
    if (!game) return GAME_NOT_FOUND_RESULT;
    const confirmedUserIds = await listParticipantUserIds({
      transaction,
      serverId,
      gameId,
      status: PARTICIPANT_STATUS.confirmed,
    });
    const now = new Date();
    const block = endSessionBlock({
      game,
      actorId: user.id,
      confirmedCount: confirmedUserIds.length,
      now,
    });
    if (!isNull(block)) {
      const error = END_SESSION_MESSAGES[block];
      return TO_ATTENDANCE_BLOCKS.includes(block) ? { error, goToAttendance: true } : { error };
    }
    await setSessionEndedAt({ transaction, serverId, gameId, endedAt: now });
    return {};
  });

  if (!result.error) {
    revalidateGamePaths({ slug: server.slug, gameId });
    after(() => notifyGameEnded({ server, gameId }));
  }
  return result;
}
