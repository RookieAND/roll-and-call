"use server";

import { withTransaction } from "@roll-and-call/database/transaction";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { type OverlapRejection } from "../model/overlap-rejection";
import { evaluateApplication } from "./evaluate-application";

// 신청글 쓰기 시트를 열기 전에 제재·이중 신청·시간 겹침·정원 검사를 먼저 거친다. 저장하지 않는다.
export async function checkJoin(
  gameId: string,
): Promise<ActionResult & { reason?: OverlapRejection["reason"]; overlapGameId?: string }> {
  const parsed = parseActionInput(idSchema, gameId);
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const evaluation = await withTransaction((transaction) =>
    evaluateApplication({ transaction, serverId: server.id, gameId, userId: user.id }),
  );
  return "error" in evaluation ? evaluation : {};
}
