"use server";

import { lockGame, setSessionEndedAt } from "@roll-and-call/database/games";
import { undoEndSessionBlock } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";

import { GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError, revalidateGamePaths } from "@/shared/server";

import { UNDO_END_SESSION_MESSAGES } from "../model/end-session-messages";

export async function undoEndSession(gameId: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const serverId = server.id;

  const result = await withTransaction(async (transaction): Promise<ActionResult> => {
    const game = await lockGame({ transaction, serverId, gameId });
    if (!game) return GAME_NOT_FOUND_RESULT;
    const block = undoEndSessionBlock({ game, actorId: user.id, now: new Date() });
    if (!isNull(block)) return { error: UNDO_END_SESSION_MESSAGES[block] };
    await setSessionEndedAt({ transaction, serverId, gameId, endedAt: null });
    return {};
  });

  if (!result.error) revalidateGamePaths({ slug: server.slug, gameId });
  return result;
}
