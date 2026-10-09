"use server";

import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";
import { z } from "zod";

import { RECRUIT_METHOD } from "@/entities/game";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { NOTE_REQUIRED_REASON } from "../model/note-required-rejection";
import { type OverlapRejection } from "../model/overlap-rejection";
import { applyToGame } from "./apply-to-game";
import { finishApplication } from "./finish-application";

const joinGameSchema = z.object({
  gameId: idSchema,
  applicationNote: z
    .string()
    .max(APPLICATION_NOTE_MAX_LENGTH * 10)
    .optional(),
});

// waiting·application은 화면 표시 시점이 아니라 실제 접수 결과라 토스트 문구가 이걸 따른다.
export async function joinGame(
  gameId: string,
  applicationNote?: string,
): Promise<
  ActionResult & {
    waiting?: boolean;
    application?: boolean;
    reason?: OverlapRejection["reason"];
    overlapGameId?: string;
  }
> {
  const parsed = parseActionInput(joinGameSchema, { gameId, applicationNote });
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const application = await applyToGame({
    serverId: server.id,
    ...parsed.data,
    userId: user.id,
  });
  if ("error" in application) {
    return "reason" in application && application.reason === NOTE_REQUIRED_REASON
      ? { error: application.error }
      : application;
  }

  await finishApplication({ server, userId: user.id, application });

  return {
    waiting: application.waiting,
    application: application.game.recruitMethod !== RECRUIT_METHOD.firstCome,
  };
}
