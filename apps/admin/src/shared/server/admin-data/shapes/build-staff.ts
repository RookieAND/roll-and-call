import type { Staff } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildStaff({ tables, nicknameOf }: ShapeContext): Staff[] {
  const discordIds = new Map(tables.profileRows.map((profile) => [profile.id, profile.discordId]));
  return tables.staffRows.map((row) => ({
    userId: row.userId,
    nickname: nicknameOf(row.userId),
    role: row.role,
    discordId: discordIds.get(row.userId),
    since: row.createdAt,
  }));
}
