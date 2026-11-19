"use server";

import { endRound as saveRoundEnd, findGameRound, lockGame } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { z } from "zod";

import {
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_RESULT,
  idSchema,
  parseActionInput,
} from "@/shared/api";
import { getActingMember, notMemberError, revalidateGamePaths } from "@/shared/server";

import type { EndSessionResult } from "../model/end-session-result";

const inputSchema = z.object({ gameId: idSchema, roundNo: z.number().int().min(1).max(52) });

// 다회차의 진행 중인 회차를 마친다. 마지막 회차면 구인이 끝난다(트리거).
export async function endRound(input: z.input<typeof inputSchema>): Promise<EndSessionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const { gameId, roundNo } = parsed.data;
  const serverId = server.id;

  const result = await withTransaction(async (transaction): Promise<EndSessionResult> => {
    const game = await lockGame({ transaction, serverId, gameId });
    if (!game || game.roundCount < 2) return GAME_NOT_FOUND_RESULT;
    if (game.gmId !== user.id) return { error: "권한이 없습니다." };
    if (game.cancelledAt) return { error: GAME_CANCELLED_MESSAGE };
    const round = await findGameRound({ transaction, serverId, gameId, roundNo });
    if (!round) return GAME_NOT_FOUND_RESULT;
    const now = new Date();
    if (isNull(round.startAt) || round.startAt > now) {
      return { error: "아직 시작하지 않은 회차입니다." };
    }
    const endAt = roundEndAt(round);
    if (round.endedAt || (endAt && endAt <= now)) {
      return { error: "이미 끝난 회차입니다.", goToAttendance: true };
    }
    await saveRoundEnd({ transaction, serverId, gameId, roundNo, endedAt: now });
    return {};
  });

  if (!result.error) revalidateGamePaths({ slug: server.slug, gameId });
  return result;
}
