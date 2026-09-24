import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { db } from "./mock-db";
import { waitedDays } from "./waited-days";

export interface UserSearchResult {
  id: string;
  nickname: string;
  playedCount: number;
  recentNoShowCount: number;
  noShows: { id: string; sessionTitle: string; startsAt: Date }[];
  certApplications: { id: string; rulebook: string; waitedDays: number; reapplied: boolean }[];
  sessions: {
    id: string;
    title: string;
    rulebook: string;
    startsAt: Date;
    gmNickname: string;
    hosted: boolean;
  }[];
}

const nicknameOf = (userId: string) => db.users.find((user) => user.id === userId)?.nickname ?? "";

// ⌘K 검색. 닉네임이 맞는 유저마다 할 수 있는 처리와 참여 세션을 묶는다.
export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const keyword = query.trim();
  if (!keyword) return [];
  return db.users
    .filter((user) => user.nickname.includes(keyword))
    .map((user) => {
      const validNoShows = db.noShows
        .filter((noShow) => noShow.userId === user.id && !noShow.cancelled)
        .map((noShow) => ({
          id: noShow.id,
          session: db.sessions.find((session) => session.id === noShow.sessionId)!,
        }))
        .toSorted((a, b) => b.session.startsAt.getTime() - a.session.startsAt.getTime());
      return {
        id: user.id,
        nickname: user.nickname,
        playedCount: user.playedCount,
        recentNoShowCount: countRecentNoShows(user.id),
        noShows: validNoShows.map(({ id, session }) => ({
          id,
          sessionTitle: session.title,
          startsAt: session.startsAt,
        })),
        certApplications: db.certApplications
          .filter(
            (application) => application.userId === user.id && application.status === "pending",
          )
          .map((application) => ({
            id: application.id,
            rulebook: application.rulebook,
            waitedDays: waitedDays(application.appliedAt),
            reapplied: application.previousRejections.length > 0,
          })),
        sessions: db.sessions
          .filter((session) => session.gmId === user.id || session.memberIds.includes(user.id))
          .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime())
          .map((session) => ({
            id: session.id,
            title: session.title,
            rulebook: session.rulebook,
            startsAt: session.startsAt,
            gmNickname: nicknameOf(session.gmId),
            hosted: session.gmId === user.id,
          })),
      };
    });
}
