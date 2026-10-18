import "server-only";
import {
  playedCountsByUser,
  recentNoShowCountsByUser,
} from "@roll-and-call/database/moderation/model";
import { groupBy, isUndefined, sortBy } from "es-toolkit";

import { waitedDays } from "@/shared/lib";

import { loadAdminData } from "./load-admin-data";
import { nicknameMatchRank } from "./nickname-match-rank";

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

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const keyword = query.trim();
  if (!keyword) return [];
  const db = await loadAdminData(["memberNicknames", "sessions", "noShows", "certApplications"]);
  const now = new Date();
  const ranked = db.memberNicknames
    .map((user) => ({ user, rank: nicknameMatchRank({ nickname: user.nickname, keyword }) }))
    .filter((entry) => !isUndefined(entry.rank));
  const users = sortBy(ranked, [(entry) => entry.rank!]).map(({ user }) => user);
  const countOptions = {
    sessions: db.sessions,
    noShows: db.noShows,
    now,
    userIds: users.map((user) => user.id),
  };
  const playedCounts = playedCountsByUser(countOptions);
  const recentNoShowCounts = recentNoShowCountsByUser(countOptions);
  const nicknames = new Map(db.memberNicknames.map((user) => [user.id, user.nickname]));
  const sessionOf = new Map(db.sessions.map((session) => [session.id, session]));
  const noShowsOf = groupBy(
    db.noShows.filter((noShow) => !noShow.cancelled),
    (noShow) => noShow.userId,
  );
  const applicationsOf = groupBy(
    db.certApplications.filter((application) => application.status === "pending"),
    (application) => application.userId,
  );
  const sessionsOf = groupBy(
    db.sessions.flatMap((session) =>
      [...new Set([session.gmId, ...session.memberIds])].map((userId) => ({ userId, session })),
    ),
    (entry) => entry.userId,
  );
  return users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    playedCount: playedCounts.get(user.id) ?? 0,
    recentNoShowCount: recentNoShowCounts.get(user.id) ?? 0,
    noShows: (noShowsOf[user.id] ?? [])
      .map((noShow) => ({ id: noShow.id, session: sessionOf.get(noShow.sessionId)! }))
      .toSorted((a, b) => b.session.startsAt.getTime() - a.session.startsAt.getTime())
      .map(({ id, session }) => ({
        id,
        sessionTitle: session.title,
        startsAt: session.startsAt,
      })),
    certApplications: (applicationsOf[user.id] ?? []).map((application) => ({
      id: application.id,
      rulebook: application.rulebook,
      waitedDays: waitedDays(application.appliedAt),
      reapplied: application.previousRejections.length > 0,
    })),
    sessions: (sessionsOf[user.id] ?? [])
      .map(({ session }) => session)
      .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime())
      .map((session) => ({
        id: session.id,
        title: session.title,
        rulebook: session.rulebook,
        startsAt: session.startsAt,
        gmNickname: nicknames.get(session.gmId) ?? "",
        hosted: session.gmId === user.id,
      })),
  }));
}
