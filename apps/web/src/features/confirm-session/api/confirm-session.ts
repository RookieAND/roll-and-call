"use server";

import { confirmGameSession, getGameConfirmedAt } from "@roll-and-call/database/games";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notifySessionConfirmed,
  refreshRecruitPost,
  notMemberError,
} from "@/shared/server";

export async function confirmSession({
  gameId,
  slotIso,
}: {
  gameId: string;
  slotIso: string;
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const confirmedAt = new Date(slotIso);
  if (Number.isNaN(confirmedAt.getTime())) return { error: "잘못된 시간입니다." };

  const previousConfirmedAt = await getGameConfirmedAt({ serverId: server.id, gameId });
  const updated = await confirmGameSession({
    serverId: server.id,
    gameId,
    gmId: user.id,
    confirmedAt,
  });

  if (!updated) return { error: "확정 권한이 없습니다." };
  after(() =>
    Promise.all([
      refreshRecruitPost({ server, gameId }),
      notifySessionConfirmed({ server, gameId, previousConfirmedAt }),
    ]),
  );

  const gamePath = serverPath({ slug: server.slug, path: `/games/${gameId}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/schedule`);
  revalidatePath(`${gamePath}/confirm`);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  redirect(gamePath);
}
