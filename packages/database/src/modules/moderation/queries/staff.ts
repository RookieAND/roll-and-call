import { and, eq } from "drizzle-orm";
import { compact } from "es-toolkit";

import { db } from "#/client";
import type { StaffRole } from "#/modules/moderation/model/types";
import { staff, type Server } from "#/schema";

const idsFromEnv = (value: string | undefined) =>
  compact((value ?? "").split(",").map((id) => id.trim()));

// ADMIN_OWNER_DISCORD_IDS는 플랫폼 관리자(개발자 계정)다. 모든 서버에서 소유자 권한을 갖고 룰북 카탈로그를 다룬다.
export function isPlatformAdmin(discordId: string) {
  return idsFromEnv(process.env.ADMIN_OWNER_DISCORD_IDS).includes(discordId);
}

// 소유자는 디스코드 서버장이고, staff 표에 있는 사람은 운영진이다.
// ponytail: 서버장을 아직 못 읽은 서버(owner_discord_id가 비어 있음)는 staff 표의 예전 owner 역할을 그대로 쓴다.
export async function getStaffRole({
  server,
  userId,
  discordId,
}: {
  server: Pick<Server, "id" | "ownerDiscordId">;
  userId: string;
  discordId: string;
}): Promise<StaffRole | null> {
  if (isPlatformAdmin(discordId) || server.ownerDiscordId === discordId) return "owner";
  const [row] = await db
    .select({ role: staff.role })
    .from(staff)
    .where(and(eq(staff.serverId, server.id), eq(staff.userId, userId)));
  if (!row) return null;
  return server.ownerDiscordId ? "staff" : row.role;
}
