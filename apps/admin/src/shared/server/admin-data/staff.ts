import "server-only";
import type { StaffRole } from "./types";

const idsFromEnv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

// ponytail: 운영진 테이블이 생기기 전까지 환경변수로 역할을 정한다.
export async function getStaffRole(discordId: string): Promise<StaffRole | null> {
  if (idsFromEnv(process.env.ADMIN_OWNER_DISCORD_IDS).includes(discordId)) return "owner";
  if (idsFromEnv(process.env.ADMIN_STAFF_DISCORD_IDS).includes(discordId)) return "staff";
  return null;
}
