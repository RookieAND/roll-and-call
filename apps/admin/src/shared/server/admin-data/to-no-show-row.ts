import type { NoShowStatus } from "@/shared/lib";

import { noShowStatusOf } from "./no-show-status-of";
import type { Snapshot } from "./snapshot";
import type { NoShow } from "./types";

export interface NoShowRow {
  id: string;
  gameId: string;
  userId: string;
  nickname: string;
  sessionTitle: string;
  rulebook: string;
  startsAt: Date;
  gmNickname: string;
  // GM이 기록했으면 GM 닉네임, 운영진이 추가했으면 「{운영진} · 운영진」.
  handler: string;
  status: NoShowStatus;
  cancelled: boolean;
}

interface ToNoShowRowOptions {
  db: Pick<Snapshot, "sessions" | "users">;
  noShow: NoShow;
  now: number;
}

export function toNoShowRow({ db, noShow, now }: ToNoShowRowOptions): NoShowRow {
  const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
  const nicknameOf = (id: string) => db.users.find((user) => user.id === id)!.nickname;
  const gmNickname = nicknameOf(session.gmId);
  return {
    id: noShow.id,
    gameId: noShow.sessionId,
    userId: noShow.userId,
    nickname: nicknameOf(noShow.userId),
    sessionTitle: session.title,
    rulebook: session.rulebook,
    startsAt: session.startsAt,
    gmNickname,
    handler: noShow.added ? `${noShow.added.by} · 운영진` : gmNickname,
    status: noShowStatusOf({ cancelled: noShow.cancelled, startsAt: session.startsAt, now }),
    cancelled: noShow.cancelled,
  };
}
