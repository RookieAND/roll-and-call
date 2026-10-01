"use server";

import { confirmGameSession, getGameConfirmedAt } from "@roll-and-call/database/web";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  getCurrentServer,
  getCurrentUser,
  notifySessionConfirmed,
  refreshRecruitPost,
} from "@/shared/server";

export async function confirmSession({
  gameId,
  slotIso,
}: {
  gameId: string;
  slotIso: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const confirmedAt = new Date(slotIso);
  if (Number.isNaN(confirmedAt.getTime())) return { error: "잘못된 시간입니다." };

  const server = await getCurrentServer();
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

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/schedule`);
  revalidatePath(`/games/${gameId}/confirm`);
  revalidatePath(`/games/${gameId}/manage`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  redirect(`/games/${gameId}`);
}
