"use server";

import { drawLottery as runLotteryDraw } from "@roll-and-call/database/games";
import { DRAW_REJECTION, DRAW_RESULT_KIND } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { ERROR_DISPLAY, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { isUuid, serverPath } from "@/shared/lib";
import { finishLotteryDraw, getActingMember, notMemberError } from "@/shared/server";

import { drawRejectionMessage } from "../model/draw-rejection-message";
import { revalidateRoster } from "./revalidate-roster";

export type DrawLotteryResult = ActionResult & { alreadyDrawn?: boolean };

// GM의 [지금 추첨하기]. 잠금·GM·취소·상태 확인은 추첨 명령이 모두 하므로 adjustRoster를 거치지 않는다.
export async function drawLottery(gameId: string): Promise<DrawLotteryResult> {
  if (!isUuid(gameId)) return GAME_NOT_FOUND_RESULT;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const result = await withTransaction((transaction) =>
    runLotteryDraw({
      transaction,
      serverId: server.id,
      gameId,
      actorId: user.id,
      now: new Date(),
    }),
  );
  if (result.kind === DRAW_RESULT_KIND.rejected) {
    const errorDisplay =
      result.reason === DRAW_REJECTION.notFound ? ERROR_DISPLAY.page : ERROR_DISPLAY.toast;
    return {
      error: drawRejectionMessage(result.reason),
      errorDisplay,
      alreadyDrawn: result.reason === DRAW_REJECTION.alreadyDrawn,
    };
  }

  revalidateRoster({ slug: server.slug, gameId });
  after(() => finishLotteryDraw({ server, gameId, result }));
  // 추첨을 생략하고 전원 확정한 글은 보여 줄 결과 화면이 없어 참여자 관리에 머문다.
  if (result.kind === DRAW_RESULT_KIND.confirmedAll) return {};
  redirect(serverPath({ slug: server.slug, path: `/games/${gameId}/draw` }));
}
