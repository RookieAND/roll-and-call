"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { getCurrentServer, getUserDetail, requireStaff, unbanGuildMember } from "@/shared/server";

// 롤앤콜에서는 차단을 풀었는데 디스코드 해제만 실패한 유저의 디스코드 차단만 다시 푼다. 데이터와 활동 기록은 바꾸지 않는다.
export async function retryGuildUnban(userId: string) {
  await requireStaff();
  const [server, user] = await Promise.all([getCurrentServer(), getUserDetail(userId)]);
  if (!user || user.membership === MEMBERSHIP_STATUS.banned) notFound();
  try {
    await unbanGuildMember({ guildId: server.discordGuildId, discordUserId: user.discordId });
  } catch (error) {
    console.error("디스코드 차단 해제에 다시 실패했습니다:", error);
    return { ok: false as const };
  }
  revalidatePath("/", "layout");
  return { ok: true as const };
}
