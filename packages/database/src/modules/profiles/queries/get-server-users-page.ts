import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import {
  SERVER_USER_SORT,
  SERVER_USERS_PAGE_SIZE,
  type ServerUserSort,
} from "#db/modules/profiles/model";
import { certifications, profiles, rulebooks, serverMembers } from "#db/schema";

import { certifiedRulebookWhere } from "./certified-rulebook-where";
import { countServerUsers } from "./count-server-users";
import { memberSessionCountsSql } from "./member-session-counts-sql";
import { recruitingCountsByGm } from "./recruiting-counts-by-gm";
import { serverUsersWhere } from "./server-users-where";

// ponytail: 정렬을 위해 멤버 전원의 건수를 매번 센다. 수백 명까지는 충분하고, 수천 명이 되면 server_members (server_id, joined_at)와 닉네임 pg_trgm 인덱스를 검토한다.
// 더 보기 방식이라 page n이면 처음부터 n쪽 분량을 준다.
export async function getServerUsersPage({
  serverId,
  page,
  q,
  certifiedRulebookId,
  hostedRulebookId,
  recruitingOnly,
  sort,
}: {
  serverId: string;
  page: number;
  q?: string;
  certifiedRulebookId?: string | null;
  hostedRulebookId?: string | null;
  recruitingOnly?: boolean;
  sort: ServerUserSort;
}) {
  const now = new Date();
  const filter = { serverId, q, certifiedRulebookId, hostedRulebookId, recruitingOnly };
  const current = Math.max(1, page);
  const recruiting = recruitingCountsByGm({ serverId, now }).as("recruiting");
  const certified = db
    .select({
      userId: certifications.userId,
      count: sql<number>`count(*)::int`.as("certified_count"),
    })
    .from(certifications)
    .innerJoin(rulebooks, eq(rulebooks.id, certifications.rulebookId))
    .where(certifiedRulebookWhere(serverId))
    .groupBy(certifications.userId)
    .as("certified");
  const { hosted, playedSingle, playedMulti } = memberSessionCountsSql({ serverId, now });

  const recruitingCount = sql<number>`coalesce(${recruiting.count}, 0)::int`;
  const certifiedRulebookCount = sql<number>`coalesce(${certified.count}, 0)::int`;
  const hostedCount = sql<number>`coalesce(${hosted.count}, 0)::int`;
  const playedCount = sql<number>`(coalesce(${playedSingle.count}, 0) + coalesce(${playedMulti.count}, 0))::int`;
  // 모집 중인 구인이 없는 사람이 대부분이라 같은 수끼리는 운영한 세션 많은 순, 그다음 최근 가입순으로 둔다.
  const orderBy = {
    [SERVER_USER_SORT.recruiting]: [
      desc(recruitingCount),
      desc(hostedCount),
      desc(serverMembers.joinedAt),
    ],
    [SERVER_USER_SORT.recent]: [desc(serverMembers.joinedAt)],
    [SERVER_USER_SORT.name]: [asc(serverMembers.nickname)],
    [SERVER_USER_SORT.rulebooks]: [desc(certifiedRulebookCount)],
    [SERVER_USER_SORT.played]: [desc(playedCount)],
    [SERVER_USER_SORT.hosted]: [desc(hostedCount)],
  }[sort];

  const [rows, total] = await Promise.all([
    db
      .select({
        userId: serverMembers.userId,
        username: serverMembers.nickname,
        avatarUrl: profiles.avatarUrl,
        bannerUrl: serverMembers.bannerUrl,
        bio: serverMembers.bio,
        keywords: serverMembers.keywords,
        featuredBadges: serverMembers.featuredBadges,
        joinedAt: serverMembers.joinedAt,
        recruitingCount,
        certifiedRulebookCount,
        hostedCount,
        playedCount,
      })
      .from(serverMembers)
      .innerJoin(profiles, eq(profiles.id, serverMembers.userId))
      .leftJoin(recruiting, eq(recruiting.gmId, serverMembers.userId))
      .leftJoin(certified, eq(certified.userId, serverMembers.userId))
      .leftJoin(hosted, eq(hosted.userId, serverMembers.userId))
      .leftJoin(playedSingle, eq(playedSingle.userId, serverMembers.userId))
      .leftJoin(playedMulti, eq(playedMulti.userId, serverMembers.userId))
      .where(serverUsersWhere({ ...filter, now }))
      .orderBy(...orderBy, asc(serverMembers.userId))
      .limit(current * SERVER_USERS_PAGE_SIZE)
      .offset(0),
    countServerUsers(filter),
  ]);
  return { rows, total, pageSize: SERVER_USERS_PAGE_SIZE };
}
