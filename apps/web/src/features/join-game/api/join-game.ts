"use server";

import { RECRUIT_METHOD } from "@/entities/game";
import { type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { type OverlapRejection } from "../model/overlap-rejection";
import { applyToGame } from "./apply-to-game";
import { finishApplication } from "./finish-application";

// waiting·lottery는 화면 표시 시점이 아니라 실제 접수 결과라 토스트 문구가 이걸 따른다.
export async function joinGame(gameId: string): Promise<
  ActionResult & {
    waiting?: boolean;
    lottery?: boolean;
    reason?: OverlapRejection["reason"];
    overlapGameId?: string;
  }
> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const application = await applyToGame({ serverId: server.id, gameId, userId: user.id });
  if ("error" in application) return application;

  await finishApplication({ server, userId: user.id, application });

  return {
    waiting: application.waiting,
    lottery: application.game.recruitMethod === RECRUIT_METHOD.lottery,
  };
}
