import { and, eq } from "drizzle-orm";
import { compact } from "es-toolkit";

import { db } from "../../../client";
import { staff } from "../../../schema";
import type { StaffRole } from "../model/types";

const idsFromEnv = (value: string | undefined) =>
  compact((value ?? "").split(",").map((id) => id.trim()));

// 역할은 staff 표가 정한다. ADMIN_OWNER_DISCORD_IDS는 표에 아무도 없을 때 첫 소유자를 들이는 입구라 모든 서버에서 늘 소유자로 본다.
export async function getStaffRole({
  serverId,
  userId,
  discordId,
}: {
  serverId: string;
  userId: string;
  discordId: string;
}): Promise<StaffRole | null> {
  if (idsFromEnv(process.env.ADMIN_OWNER_DISCORD_IDS).includes(discordId)) return "owner";
  const [row] = await db
    .select({ role: staff.role })
    .from(staff)
    .where(and(eq(staff.serverId, serverId), eq(staff.userId, userId)));
  return row?.role ?? null;
}
