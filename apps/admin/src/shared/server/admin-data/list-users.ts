import "server-only";
import { MEMBERSHIP_STATUS, type MembershipStatus } from "@/shared/lib";

import { countRecentNoShows } from "./count-recent-no-shows";
import { isSanctioned } from "./is-sanctioned";
import { previousNicknamesOf } from "./previous-nicknames-of";
import { loadSnapshot } from "./snapshot";

const WEEK = 7 * 86_400_000;

export const USER_FILTERS = {
  gm: "GM (인증 룰북 있음)",
  noshow: "최근 30일 불참 2회 이상",
  sanctioned: "제재 중",
  recent: "최근 가입 (7일)",
} as const;
export type UserFilter = keyof typeof USER_FILTERS;

export interface UserRow {
  id: string;
  nickname: string;
  joinedAt: Date;
  isNew: boolean;
  hostedCount: number;
  playedCount: number;
  recentNoShowCount: number;
  certifiedCount: number;
  membership: MembershipStatus;
  sanctioned: boolean;
  sanctionUntil: Date | null;
}

// 멤버십 상태를 먼저 고르고, 빠른 필터는 그 안에서 건다. 검색은 운영진이 바꾸기 전 닉네임도 찾는다.
export async function listUsers({
  query,
  filter,
  membership = MEMBERSHIP_STATUS.active,
}: {
  query?: string;
  filter?: UserFilter;
  membership?: MembershipStatus;
}) {
  const db = await loadSnapshot();
  const now = Date.now();
  const keyword = query?.trim();
  const matchesQuery = (userId: string, nickname: string) =>
    !keyword ||
    nickname.includes(keyword) ||
    previousNicknamesOf({ auditLog: db.auditLog, userId }).some((previous) =>
      previous.includes(keyword),
    );
  const rows: UserRow[] = db.users
    .filter((user) => user.membership === membership && matchesQuery(user.id, user.nickname))
    .map((user) => ({
      id: user.id,
      nickname: user.nickname,
      joinedAt: user.joinedAt,
      isNew: now - user.joinedAt.getTime() < WEEK,
      hostedCount: user.hostedCount,
      playedCount: user.playedCount,
      recentNoShowCount: countRecentNoShows(db, user.id, now),
      certifiedCount: db.certifications.filter((item) => item.userId === user.id).length,
      membership: user.membership,
      sanctioned: isSanctioned(user, now),
      sanctionUntil: isSanctioned(user, now) ? (user.sanction?.until ?? null) : null,
    }));
  const matchesFilter = (row: UserRow) => {
    if (filter === "gm") return row.certifiedCount > 0;
    if (filter === "noshow") return row.recentNoShowCount >= 2;
    if (filter === "sanctioned") return row.sanctioned;
    if (filter === "recent") return row.isNew;
    return true;
  };
  return rows.filter(matchesFilter);
}
