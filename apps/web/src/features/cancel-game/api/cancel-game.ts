"use server";

import { cancelGame, isGameOwner } from "@roll-and-call/database/games";
import { isNull } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import { GAME_CANCEL_KIND } from "@/entities/game";
import {
  GAME_ALREADY_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_RESULT,
  idSchema,
  parseActionInput,
  SESSION_STARTED_CANCEL_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notifyGameCancelled, notMemberError } from "@/shared/server";

import { cancelReasonError } from "../model/cancel-reason-error";

// 사유의 길이 안내는 cancelReasonError가 한다. 여기서는 터무니없이 긴 입력만 막는다.
const REASON_INPUT_MAX = 2000;

const inputSchema = z.object({ gameId: idSchema, reason: z.string().max(REASON_INPUT_MAX) });

const BLOCKED_RESULT = {
  not_found: GAME_NOT_FOUND_RESULT,
  already_cancelled: { error: GAME_ALREADY_CANCELLED_MESSAGE },
  session_started: { error: SESSION_STARTED_CANCEL_MESSAGE },
} as const satisfies Record<string, ActionResult>;

export async function cancelGameAsGm(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, reason } = parsed.data;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;

  const reasonError = cancelReasonError(reason);
  if (!isNull(reasonError)) return { error: reasonError, field: "reason" };

  if (!(await isGameOwner({ serverId: server.id, gameId, gmId: user.id }))) {
    return { error: "취소 권한이 없습니다." };
  }

  const result = await cancelGame({
    serverId: server.id,
    gameId,
    kind: GAME_CANCEL_KIND.gm,
    actorId: user.id,
    reason: reason.trim(),
  });
  if (!result.ok) return BLOCKED_RESULT[result.reason];

  after(() => notifyGameCancelled({ server, game: result.game }));

  const gamePath = serverPath({ slug: server.slug, path: `/games/${gameId}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(serverPath({ slug: server.slug, path: "/me/sessions" }));
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  redirect(gamePath);
}
