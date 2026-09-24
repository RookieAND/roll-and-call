import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { isSanctioned } from "./is-sanctioned";
import { db } from "./mock-db";

const WEEK = 7 * 86_400_000;

export const USER_FILTERS = {
  gm: "GM (인증 룰북 있음)",
  noshow: "최근 3개월 불참 2회 이상",
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
  sanctioned: boolean;
  sanctionUntil: Date | null;
}

export async function listUsers({ query, filter }: { query?: string; filter?: UserFilter }) {
  const now = Date.now();
  const rows: UserRow[] = db.users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    joinedAt: user.joinedAt,
    isNew: now - user.joinedAt.getTime() < WEEK,
    hostedCount: user.hostedCount,
    playedCount: user.playedCount,
    recentNoShowCount: countRecentNoShows(user.id, now),
    certifiedCount: db.certifications.filter((item) => item.userId === user.id).length,
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
  return rows.filter((row) => (!query || row.nickname.includes(query)) && matchesFilter(row));
}
