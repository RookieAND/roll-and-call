import "server-only";
import { loadSnapshot } from "./snapshot";

export interface StaffCandidate {
  id: string;
  nickname: string;
  discordHandle: string;
  joinedAt: Date;
}

// 운영진 추가 검색. 디스코드 닉네임이 맞고 아직 운영진이 아닌 멤버만 돌려준다.
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
