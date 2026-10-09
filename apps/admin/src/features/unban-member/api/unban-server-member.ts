"use server";

import {
  parseReason,
  USER_ACTION_REASON,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { chosenReasonSchema, idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff, unbanGuildMember, unbanMember } from "@/shared/server";

const schema = z.object({
  userId: idSchema,
  reason: chosenReasonSchema.nullable(),
});

// 롤앤콜 차단을 먼저 풀고 디스코드 차단을 푼다. 디스코드 쪽이 실패해도(봇 권한·연결) 롤앤콜 해제는 그대로 두고 discordUnbanned로 알린다.
// 그사이 다른 운영진이 먼저 풀었으면 그 사람과 시각을 돌려준다(D296).
export async function unbanServerMember(args: { userId: string; reason: ChosenReason | null }) {
  const staff = await requireStaff();
  const { userId, reason } = parseActionInput(schema, args);
  const parsed = parseReason({ reason, reasons: USER_ACTION_REASON });
  const server = await getCurrentServer();
  const result = await unbanMember({ serverId: server.id, userId, actor: staff, reason: parsed });
  revalidatePath("/", "layout");
  if (!result.ok) {
    const conflict = result.conflict;
    return {
      ok: false as const,
      conflict: conflict ? { by: conflict.by, at: conflict.at } : null,
      self: conflict?.byId === staff.id,
    };
  }
  try {
    await unbanGuildMember({ guildId: server.discordGuildId, discordUserId: result.discordId });
  } catch (error) {
    console.error("디스코드 차단 해제에 실패했습니다:", error);
    return { ok: true as const, discordUnbanned: false };
  }
  return { ok: true as const, discordUnbanned: true };
}
