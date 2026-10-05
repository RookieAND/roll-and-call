"use server";

import {
  parseReason,
  USER_ACTION_REASON,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";
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
// 서버 소유자·운영진·본인은 추방할 수 없다. 그사이 다른 운영진이 먼저 추방했으면 그 사람과 시각을 돌려준다(D296).
export async function kickServerMember({
  userId,
  reason,
}: {
  userId: string;
  reason: ChosenReason | null;
}) {
  const staff = await requireStaff();
  const parsed = parseReason({ reason, reasons: USER_ACTION_REASON });
  const [server, user] = await Promise.all([getCurrentServer(), getUserDetail(userId)]);
  if (!user) notFound();
  if (user.discordId === server.ownerDiscordId || user.staffRole || user.id === staff.id) {
    forbidden();
  }

  const result = await kickMember({ serverId: server.id, userId, actor: staff, reason: parsed });
  if (!result.ok) {
    revalidatePath("/", "layout");
    const conflict = result.conflict;
    return {
      ok: false as const,
      conflict: conflict ? { by: conflict.by, at: conflict.at } : null,
      self: conflict?.byId === staff.id,
    };
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
