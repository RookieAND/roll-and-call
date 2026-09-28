import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  adminSettings,
  auditLog,
  certApplications,
  certifications,
  reports,
  rulebookRequests,
  rulebooks,
  sanctions,
  staff,
  staffMemos,
  availabilities,
  availabilitiesRelations,
  games,
  gamesRelations,
  participants,
  participantsRelations,
  participantStatus,
  profiles,
  profilesRelations,
  scheduleMode,
} from "./schema";

// 사용자 앱은 트랜잭션 풀러(:6543), 어드민은 세션 풀러(:5432)를 쓴다.
// max — 트랜잭션 풀러는 동시 쿼리가 max를 넘어 줄을 서면 가끔 응답을 멈추므로(2026-09-28 재현, /me)
// 사용자 앱은 DATABASE_POOL_MAX=20으로 넉넉히 둔다. 세션 풀러는 모든 인스턴스·로컬 개발을 합쳐
// 15개까지만 받아 web까지 옮기면 EMAXCONNSESSION이 났다. 어드민은 3이다.
// idle_timeout — 쉬는 연결을 닫아 풀러 자리를 오래 붙잡지 않는다.
// prepare: false — 풀러를 거치므로 준비된 문장을 쓰지 않는다.
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: Number(process.env.DATABASE_POOL_MAX ?? 6),
  idle_timeout: 20,
});

export const db = drizzle(client, {
  schema: {
    scheduleMode,
    participantStatus,
    profiles,
    games,
    participants,
    availabilities,
    profilesRelations,
    gamesRelations,
    participantsRelations,
    availabilitiesRelations,
    rulebooks,
    rulebookRequests,
    certApplications,
    certifications,
    sanctions,
    reports,
    staff,
    staffMemos,
    auditLog,
    adminSettings,
  },
});
