"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { banGuildMember, getCurrentServer, getUserDetail, requireStaff } from "@/shared/server";

// 추방은 끝났는데 디스코드 차단만 실패한 유저를 다시 차단한다. 롤앤콜 데이터와 활동 기록은 바꾸지 않는다.
export async function retryGuildBan(userId: string) {
  await requireStaff();
  const [server, user] = await Promise.all([getCurrentServer(), getUserDetail(userId)]);
  if (!user || user.membership !== MEMBERSHIP_STATUS.banned) notFound();
  try {
    await banGuildMember({ guildId: server.discordGuildId, discordUserId: user.discordId });
  } catch (error) {
    console.error("디스코드 차단에 다시 실패했습니다:", error);
    return { ok: false as const };
  }
  revalidatePath("/", "layout");
  return { ok: true as const };
}
