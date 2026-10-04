import { countPlayedSessions } from "./count-played-sessions";
import { countRecentNoShows } from "./count-recent-no-shows";
import { isSanctioned } from "./is-sanctioned";
import { previousNicknamesOf } from "./previous-nicknames-of";
import type { Snapshot } from "./snapshot";
import type { AdminUser } from "./types";
import type { UserRow } from "./user-row";

const NEW_MEMBER_DAYS = 7;
const DAY = 86_400_000;

export type UserRowSource = Pick<Snapshot, "noShows" | "sessions" | "certifications" | "auditLog">;

// 가입일·신규는 그 서버에 처음 가입한 날(server_members.joined_at) 기준이다.
export function toUserRow({ user, db, now }: { user: AdminUser; db: UserRowSource; now: Date }) {
  const sanctioned = isSanctioned(user, now.getTime());
  const row: UserRow = {
    id: user.id,
    nickname: user.nickname,
    discordId: user.discordId,
    discordHandle: user.discordHandle,
    previousNicknames: previousNicknamesOf({ auditLog: db.auditLog, userId: user.id }),
    joinedAt: user.memberJoinedAt,
    isNew: now.getTime() - user.memberJoinedAt.getTime() < NEW_MEMBER_DAYS * DAY,
    hostedCount: user.hostedCount,
    playedCount: countPlayedSessions({ db, userId: user.id, now }),
    recentNoShowCount: countRecentNoShows(db, user.id, now.getTime()),
    certifiedCount: db.certifications.filter((item) => item.userId === user.id).length,
    membership: user.membership,
    sanctioned,
    sanctionUntil: sanctioned ? (user.sanction?.until ?? null) : null,
  };
  return row;
}
