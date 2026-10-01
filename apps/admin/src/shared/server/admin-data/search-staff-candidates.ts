import "server-only";
import { loadSnapshot } from "./snapshot";

export interface StaffCandidate {
  id: string;
  nickname: string;
  discordHandle: string;
  joinedAt: Date;
}

export async function searchStaffCandidates(query: string): Promise<StaffCandidate[]> {
  const db = await loadSnapshot();
  const keyword = query.trim();
  if (!keyword) return [];
  const staffNicknames = new Set(db.staff.map((staff) => staff.nickname));
  return db.users
    .filter((user) => user.nickname.includes(keyword) && !staffNicknames.has(user.nickname))
    .map(({ id, nickname, discordHandle, joinedAt }) => ({
      id,
      nickname,
      discordHandle,
      joinedAt,
    }));
}
