import { and, eq, getTableColumns, isNull, ne, sql } from "drizzle-orm";
import { omit } from "es-toolkit";

import { db } from "#db/client";
import {
  auditLog,
  certApplications,
  certifications,
  certSellers,
  games,
  participants,
  profiles,
  rulebookCategories,
  rulebookQuizQuestions,
  rulebookRequestGames,
  rulebookRequests,
  rulebooks,
  sanctions,
  serverMembers,
  sessionReviews,
  staff,
  staffMemos,
} from "#db/schema";

// 어드민 화면이 읽는 표. 룰북·카테고리·퀴즈 문항·판매처까지 모두 그 서버 것만 읽는다.
// 사람(profiles)은 그 서버 멤버만 읽고, 멤버십 상태(탈퇴·차단)를 함께 붙인다.
// 트랜잭션 풀러(:6543)에 여러 개를 Promise.all로 한꺼번에 보내면 응답이 멈춘다(2026-09-24 재현). 호출하는 쪽이 순서대로 읽는다.
const ADMIN_TABLE_LOADERS = {
  profileRows: (serverId: string) =>
    db
      .select({
        ...getTableColumns(profiles),
        nickname: serverMembers.nickname,
        memberJoinedAt: serverMembers.joinedAt,
        leftAt: serverMembers.deletedAt,
        rejoinedAt: serverMembers.rejoinedAt,
        bannedAt: serverMembers.bannedAt,
        bannedBy: serverMembers.bannedBy,
        banReasonCode: serverMembers.banReasonCode,
        banReasonText: serverMembers.banReasonText,
      })
      .from(profiles)
      .innerJoin(
        serverMembers,
        and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
      )
      .orderBy(profiles.createdAt, profiles.id),
  gameRows: (serverId: string) => db.select().from(games).where(eq(games.serverId, serverId)),
  // 신청글 본문은 싣지 않는다. 있는지만 알리고, 본문은 운영진이 [신청글 보기]를 누를 때 따로 읽는다.
  participantRows: (serverId: string) =>
    db
      .select({
        ...omit(getTableColumns(participants), ["applicationNote"]),
        hasApplicationNote: sql<boolean>`${participants.applicationNote} is not null`,
      })
      .from(participants)
      .where(eq(participants.serverId, serverId)),
  rulebookRows: (serverId: string) =>
    db
      .select({
        ...getTableColumns(rulebooks),
        category: rulebookCategories.name,
        categoryAlias: rulebookCategories.alias,
        categoryMiniRule: rulebookCategories.miniRule,
      })
      .from(rulebooks)
      .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
      .where(eq(rulebooks.serverId, serverId)),
  requestRows: (serverId: string) =>
    db.select().from(rulebookRequests).where(eq(rulebookRequests.serverId, serverId)),
  requestGameRows: (serverId: string) =>
    db.select().from(rulebookRequestGames).where(eq(rulebookRequestGames.serverId, serverId)),
  categoryRows: (serverId: string) =>
    db.select().from(rulebookCategories).where(eq(rulebookCategories.serverId, serverId)),
  applicationRows: (serverId: string) =>
    db.select().from(certApplications).where(eq(certApplications.serverId, serverId)),
  certificationRows: (serverId: string) =>
    db.select().from(certifications).where(eq(certifications.serverId, serverId)),
  quizRows: (serverId: string) =>
    db.select().from(rulebookQuizQuestions).where(eq(rulebookQuizQuestions.serverId, serverId)),
  sellerRows: (serverId: string) =>
    db
      .select()
      .from(certSellers)
      .where(eq(certSellers.serverId, serverId))
      .orderBy(certSellers.createdAt),
  sanctionRows: (serverId: string) =>
    db
      .select()
      .from(sanctions)
      .where(and(eq(sanctions.serverId, serverId), isNull(sanctions.releasedAt))),
  reviewRows: (serverId: string) =>
    db.select().from(sessionReviews).where(eq(sessionReviews.serverId, serverId)),
  staffRows: (serverId: string) => db.select().from(staff).where(eq(staff.serverId, serverId)),
  memoRows: (serverId: string) =>
    db.select().from(staffMemos).where(eq(staffMemos.serverId, serverId)),
  auditRows: (serverId: string) =>
    db.select().from(auditLog).where(eq(auditLog.serverId, serverId)),
  // 닉네임 수정 기록만. 유저 목록의 이전 닉네임 검색용이라 활동 기록 전체를 읽지 않는다.
  nicknameEditRows: (serverId: string) =>
    db
      .select({
        targetUserId: auditLog.targetUserId,
        before: auditLog.before,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .where(and(eq(auditLog.serverId, serverId), eq(auditLog.action, "닉네임 수정"))),
  // 운영진 목록의 마지막 활동 시각. 활동 기록 전체 대신 행위자별 최근 시각만 읽는다.
  lastActiveRows: (serverId: string) =>
    db
      .select({
        actorId: auditLog.actorId,
        lastAt: sql`max(${auditLog.createdAt})`.mapWith(auditLog.createdAt),
      })
      .from(auditLog)
      .where(and(eq(auditLog.serverId, serverId), ne(auditLog.actorKind, "system")))
      .groupBy(auditLog.actorId),
  // 디스코드 아이디는 profiles에 없다(username은 계정 이름이고 닉네임은 server_members.nickname). 디스코드 로그인은 full_name에 아이디를 넣는다.
  handleRows: (serverId: string) =>
    db.execute<{ id: string; handle: string | null }>(
      sql`select u.id, u.raw_user_meta_data->>'full_name' as handle
        from auth.users u
        join public.server_members m on m.user_id = u.id and m.server_id = ${serverId}`,
    ),
} as const;

export type AdminTableKey = keyof typeof ADMIN_TABLE_LOADERS;

export type AdminTables = {
  [Key in AdminTableKey]: Awaited<ReturnType<(typeof ADMIN_TABLE_LOADERS)[Key]>>;
};

export const ADMIN_TABLE_KEYS = Object.keys(ADMIN_TABLE_LOADERS) as AdminTableKey[];

export function loadAdminTable<Key extends AdminTableKey>(
  serverId: string,
  key: Key,
): Promise<AdminTables[Key]> {
  const load: (serverId: string) => Promise<unknown> = ADMIN_TABLE_LOADERS[key];
  return load(serverId) as Promise<AdminTables[Key]>;
}
