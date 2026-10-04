import { isRecognizedPost } from "./recognized-session";
import type { Snapshot } from "./snapshot";

// 확정으로 참여한 인정 세션 수. 취소되지 않은 불참(기간이 지난 것 포함)은 참여로 세지 않는다.
export function countPlayedSessions({
  db,
  userId,
  now,
}: {
  db: Pick<Snapshot, "noShows" | "sessions">;
  userId: string;
  now: Date;
}) {
  const absentSessionIds = new Set(
    db.noShows
      .filter((noShow) => noShow.userId === userId && !noShow.cancelled)
      .map((noShow) => noShow.sessionId),
  );
  return db.sessions.filter(
    (session) =>
      session.memberIds.includes(userId) &&
      !absentSessionIds.has(session.id) &&
      isRecognizedPost(session, now),
  ).length;
}
