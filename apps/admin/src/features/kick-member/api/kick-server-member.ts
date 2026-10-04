"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import { after } from "next/server";

import {
  banGuildMember,
  getCurrentServer,
  getUserDetail,
  kickMember,
  notifyGameCancelled,
  notifyGameLeft,
  refreshRecruitPost,
  requireStaff,
} from "@/shared/server";

// 롤앤콜 쪽 정리를 먼저 끝내고 디스코드 차단을 한다. 디스코드 쪽이 실패해도 데이터 변경은 그대로 두고 discordBanned로 알린다.
export async function kickServerMember(userId: string, reason: string) {
  const staff = await requireStaff();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("추방 사유를 입력해 주세요");
  const [server, user] = await Promise.all([getCurrentServer(), getUserDetail(userId)]);
  if (!user) notFound();
  if (user.discordId === server.ownerDiscordId) forbidden();

  const result = await kickMember({ serverId: server.id, userId, actor: staff, reason: trimmed });
  if (!result.ok) {
    revalidatePath("/", "layout");
    return { ok: false as const };
  }

  let discordBanned = true;
  try {
    await banGuildMember({ guildId: server.discordGuildId, discordUserId: result.discordId });
  } catch (error) {
    console.error("디스코드 차단에 실패했습니다:", error);
    discordBanned = false;
  }

  after(async () => {
    for (const game of result.cancelledGames) await notifyGameCancelled({ server, game });
    for (const gameId of result.leftGameIds) {
      await notifyGameLeft({ server, gameId, userId, removedByGm: true });
      await refreshRecruitPost({ server, gameId });
    }
  });
  revalidatePath("/", "layout");
  return { ok: true as const, discordBanned };
}
