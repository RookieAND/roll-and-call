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

// 두 앱 모두 세션 풀러(:5432)를 쓴다. 트랜잭션 풀러(:6543)는 동시 쿼리가 max를 넘어 줄을 서면
// 가끔 응답을 멈춘다(2026-09-28 재현, /me가 멈췄다).
// max — 세션 풀러는 모든 인스턴스를 합쳐 15개까지 받으므로 DATABASE_POOL_MAX로 web 4, admin 3을 준다.
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
