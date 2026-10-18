import { isSanctioned } from "@roll-and-call/database/moderation/model";

import type { AdminUser } from "@/shared/server";

import type { UserRow } from "./user-row";

const NEW_MEMBER_DAYS = 7;
const DAY = 86_400_000;

interface ToUserRowOptions {
  user: AdminUser;
  now: Date;
  playedCount: number;
  recentNoShowCount: number;
  certifiedCount: number;
  previousNicknames: string[];
}

// 가입일·신규는 그 서버에 처음 가입한 날(server_members.joined_at) 기준이다.
export function toUserRow({ user, now, ...counts }: ToUserRowOptions): UserRow {
  const sanctioned = isSanctioned(user, now.getTime());
  return {
    id: user.id,
    nickname: user.nickname,
    discordId: user.discordId,
    discordHandle: user.discordHandle,
    joinedAt: user.memberJoinedAt,
    isNew: now.getTime() - user.memberJoinedAt.getTime() < NEW_MEMBER_DAYS * DAY,
    hostedCount: user.hostedCount,
    membership: user.membership,
    sanctioned,
    sanctionUntil: sanctioned ? (user.sanction?.until ?? null) : null,
    ...counts,
  };
}
