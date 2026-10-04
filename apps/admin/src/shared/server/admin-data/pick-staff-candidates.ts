import { MEMBERSHIP_STATUS } from "@/shared/lib";

import type { AdminUser } from "./types";

export const STAFF_CANDIDATE_LIMIT = 20;

export interface StaffCandidate {
  id: string;
  nickname: string;
  discordHandle: string;
  joinedAt: Date;
}

interface PickStaffCandidatesOptions {
  users: Pick<AdminUser, "id" | "nickname" | "discordHandle" | "joinedAt" | "membership">[];
  staffIds: ReadonlySet<string>;
  query: string;
}

// 지금 가입해 있는 멤버를 서버 닉네임 부분 일치(대소문자 무시)로 찾는다. 운영진은 닉네임이 아니라 사용자 ID로 뺀다.
export function pickStaffCandidates({
  users,
  staffIds,
  query,
}: PickStaffCandidatesOptions): StaffCandidate[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];
  return users
    .filter(
      (user) =>
        user.membership === MEMBERSHIP_STATUS.active &&
        !staffIds.has(user.id) &&
        user.nickname.toLowerCase().includes(keyword),
    )
    .slice(0, STAFF_CANDIDATE_LIMIT)
    .map(({ id, nickname, discordHandle, joinedAt }) => ({
      id,
      nickname,
      discordHandle,
      joinedAt,
    }));
}
