"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, requireStaff, unbanGuildMember, unbanMember } from "@/shared/server";

// 롤앤콜 차단을 먼저 풀고 디스코드 차단을 푼다. 디스코드 쪽이 실패해도(봇 연결 끊김 등) 데이터 변경은 그대로 둔다.
export async function unbanServerMember(userId: string, reason: string) {
  const staff = await requireStaff();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("해제 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await unbanMember({ serverId: server.id, userId, actor: staff, reason: trimmed });
  if (result.ok) {
    try {
      await unbanGuildMember({ guildId: server.discordGuildId, discordUserId: result.discordId });
    } catch (error) {
      console.error("디스코드 차단 해제에 실패했습니다:", error);
    }
  }
  revalidatePath("/", "layout");
  return { ok: result.ok };
}
