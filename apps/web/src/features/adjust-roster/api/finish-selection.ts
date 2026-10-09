"use server";

import { finishSelection as runSelectionFinish } from "@roll-and-call/database/games";
import { SELECTION_REJECTION } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { after } from "next/server";

import { ERROR_DISPLAY, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { isUuid } from "@/shared/lib";
import { finishSelectionNotices, getActingMember, notMemberError } from "@/shared/server";

import { selectionRejectionMessage } from "../model/selection-rejection-message";
import { revalidateRoster } from "./revalidate-roster";

// GM의 [선발 마치기]. 잠금·GM·취소·상태 확인은 명령이 모두 하므로 adjustRoster를 거치지 않는다.
export async function finishSelection(gameId: string): Promise<ActionResult> {
  if (!isUuid(gameId)) return GAME_NOT_FOUND_RESULT;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const result = await withTransaction((transaction) =>
    runSelectionFinish({
      transaction,
      serverId: server.id,
      gameId,
      actorId: user.id,
      now: new Date(),
    }),
  );
  if (result.kind === "rejected") {
    const errorDisplay =
      result.reason === SELECTION_REJECTION.notFound ? ERROR_DISPLAY.page : ERROR_DISPLAY.toast;
    return { error: selectionRejectionMessage(result.reason, result.minPlayers), errorDisplay };
  }

  revalidateRoster({ slug: server.slug, gameId });
  after(() => finishSelectionNotices({ server, gameId, result }));
  return {};
}
