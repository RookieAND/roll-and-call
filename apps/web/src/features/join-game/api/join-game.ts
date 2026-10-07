"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { RECRUIT_METHOD } from "@/entities/game";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  announceRecruitmentComplete,
  getActingMember,
  grantRushBadge,
  refreshRecruitPost,
  notMemberError,
} from "@/shared/server";

import { type OverlapRejection } from "../model/overlap-rejection";
import { announceNewApplication } from "./announce-new-application";
import { applyToGame } from "./apply-to-game";

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

  after(async () => {
    await announceNewApplication({
      server,
      game: application.game,
      applicantId: user.id,
      isWaiting: application.waiting,
      confirmedCount: application.confirmedCount,
    });
    if (application.becameFull) {
      await announceRecruitmentComplete({ server, gameId });
      await grantRushBadge({ serverId: server.id, gameId });
    }
    await refreshRecruitPost({ server, gameId });
  });

  const gamePath = serverPath({ slug: server.slug, path: `/games/${gameId}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  return {
    waiting: application.waiting,
    lottery: application.game.recruitMethod === RECRUIT_METHOD.lottery,
  };
}
