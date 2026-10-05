import { and, eq, getTableColumns, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
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
  rulebookRequests,
  rulebooks,
  sanctions,
  serverMembers,
  sessionReviews,
  staff,
  staffMemos,
} from "#/schema";

// 어드민 스냅숏이 읽는 표 전체. 룰북·카테고리·퀴즈 문항·판매처까지 모두 그 서버 것만 읽는다.
// 사람(profiles)은 그 서버 멤버만 읽고, 멤버십 상태(탈퇴·차단)를 함께 붙인다.
export async function loadAdminTables(serverId: string) {
  // 트랜잭션 풀러(:6543)에 13개를 Promise.all로 한꺼번에 보내면 응답이 멈춘다(2026-09-24 재현).
  // 같은 리전이라 순서대로 읽어도 0.1초 남짓이다.
  const profileRows = await db
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
    .orderBy(profiles.createdAt, profiles.id);
  const gameRows = await db.select().from(games).where(eq(games.serverId, serverId));
  const participantRows = await db
    .select()
    .from(participants)
    .where(eq(participants.serverId, serverId));
  const rulebookRows = await db
    .select({ ...getTableColumns(rulebooks), category: rulebookCategories.name })
    .from(rulebooks)
    .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(eq(rulebooks.serverId, serverId));
  const requestRows = await db
    .select()
    .from(rulebookRequests)
    .where(eq(rulebookRequests.serverId, serverId));
  const categoryRows = await db
    .select()
    .from(rulebookCategories)
    .where(eq(rulebookCategories.serverId, serverId));
  const applicationRows = await db
    .select()
    .from(certApplications)
    .where(eq(certApplications.serverId, serverId));
  const certificationRows = await db
    .select()
    .from(certifications)
    .where(eq(certifications.serverId, serverId));
  const quizRows = await db
    .select()
    .from(rulebookQuizQuestions)
    .where(eq(rulebookQuizQuestions.serverId, serverId));
  const sellerRows = await db
    .select()
    .from(certSellers)
    .where(eq(certSellers.serverId, serverId))
    .orderBy(certSellers.createdAt);
  const sanctionRows = await db
    .select()
    .from(sanctions)
    .where(and(eq(sanctions.serverId, serverId), isNull(sanctions.releasedAt)));
  const reviewRows = await db
    .select()
    .from(sessionReviews)
    .where(eq(sessionReviews.serverId, serverId));
  const staffRows = await db.select().from(staff).where(eq(staff.serverId, serverId));
  const memoRows = await db.select().from(staffMemos).where(eq(staffMemos.serverId, serverId));
  const auditRows = await db.select().from(auditLog).where(eq(auditLog.serverId, serverId));
  // 디스코드 아이디는 profiles에 없다(username은 계정 이름이고 닉네임은 server_members.nickname). 디스코드 로그인은 full_name에 아이디를 넣는다.
  const handleRows = await db.execute<{ id: string; handle: string | null }>(
    sql`select u.id, u.raw_user_meta_data->>'full_name' as handle
        from auth.users u
        join public.server_members m on m.user_id = u.id and m.server_id = ${serverId}`,
  );
  return {
    profileRows,
    gameRows,
    participantRows,
    rulebookRows,
    requestRows,
    categoryRows,
    applicationRows,
    certificationRows,
    quizRows,
    sellerRows,
    sanctionRows,
    reviewRows,
    staffRows,
    memoRows,
    auditRows,
    handleRows,
  };
}

export type AdminTables = Awaited<ReturnType<typeof loadAdminTables>>;
