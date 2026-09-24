import "server-only";
import type { Snapshot } from "./snapshot";
import type { NoShow } from "./types";

export type NoShowTiming = "before" | "after";

export interface NoShowRow {
  id: string;
  userId: string;
  nickname: string;
  sessionTitle: string;
  rulebook: string;
  startsAt: Date;
  gmNickname: string;
  timing: NoShowTiming;
  cancelled: boolean;
}

export function toNoShowRow(db: Snapshot, noShow: NoShow): NoShowRow {
  const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
  const nicknameOf = (id: string) => db.users.find((user) => user.id === id)!.nickname;
  return {
    id: noShow.id,
    userId: noShow.userId,
    nickname: nicknameOf(noShow.userId),
    sessionTitle: session.title,
    rulebook: session.rulebook,
    startsAt: session.startsAt,
    gmNickname: nicknameOf(session.gmId),
    timing: noShow.recordedAt < session.startsAt ? "before" : "after",
    cancelled: noShow.cancelled,
  };
}
