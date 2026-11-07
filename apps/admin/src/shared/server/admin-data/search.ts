import "server-only";
import { loadAdminMemberActivity, searchAdminMembers } from "@roll-and-call/database/moderation";
import {
  playedCountsByUser,
  recentNoShowCountsByUser,
} from "@roll-and-call/database/moderation/model";
import { groupBy } from "es-toolkit";

import { waitedDays } from "@/shared/lib";

import { getCurrentServer } from "../auth/get-current-server";
import { requireStaff } from "../auth/require-staff";
import { buildShapes } from "./build-shapes";

// ponytail: 한 글자 검색처럼 많이 맞으면 앞의 이만큼만 보인다. 더 보여야 하면 늘린다.
const SEARCH_LIMIT = 20;

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
  await requireStaff();
  const server = await getCurrentServer();
  const users = await searchAdminMembers({ serverId: server.id, keyword, limit: SEARCH_LIMIT });
  if (users.length === 0) return [];
  // 맞은 사람과 관련된 행만 읽어 같은 모양으로 만든다.
  const tables = await loadAdminMemberActivity({
    serverId: server.id,
    userIds: users.map((user) => user.id),
  });
  const now = new Date();
  const db = buildShapes({
    tables,
    now: now.getTime(),
    keys: ["memberNicknames", "sessions", "noShows", "certApplications"],
  });
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
