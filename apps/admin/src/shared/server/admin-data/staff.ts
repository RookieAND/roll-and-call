import "server-only";
import { db, staff } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import type { StaffRole } from "./types";

const idsFromEnv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

// 역할은 staff 표가 정한다. ADMIN_OWNER_DISCORD_IDS는 표에 아무도 없을 때 첫 소유자를 들이는 입구라 늘 소유자로 본다.
export async function getStaffRole(userId: string, discordId: string): Promise<StaffRole | null> {
  if (idsFromEnv(process.env.ADMIN_OWNER_DISCORD_IDS).includes(discordId)) return "owner";
  const [row] = await db.select({ role: staff.role }).from(staff).where(eq(staff.userId, userId));
  return row?.role ?? null;
}
