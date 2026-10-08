import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  auditLog,
  certApplications,
  certifications,
  reports,
  rulebookCategories,
  rulebookRequests,
  rulebooks,
  rulebooksRelations,
  sanctions,
  staff,
  staffMemos,
  availabilities,
  availabilitiesRelations,
  drawResults,
  drawResultsRelations,
  games,
  gamesRelations,
  participants,
  participantsRelations,
  participantStatus,
  profiles,
  profilesRelations,
  scheduleMode,
} from "./schema";

// 트랜잭션 풀러는 쿼리가 max를 넘어 줄을 서면 멈출 수 있어 web은 DATABASE_POOL_MAX를 넉넉히(20) 둔다.
// 개발 서버는 핫 리로드마다 이 모듈을 다시 읽어 연결 묶음이 새로 생기므로 전역에 한 번만 만든다.
const globalForClient = globalThis as unknown as { databaseClient?: ReturnType<typeof postgres> };
const client =
  globalForClient.databaseClient ??
  postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: Number(process.env.DATABASE_POOL_MAX ?? 6),
    idle_timeout: 20,
  });
if (process.env.NODE_ENV !== "production") globalForClient.databaseClient = client;

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
    drawResults,
    drawResultsRelations,
    rulebookCategories,
    rulebooks,
    rulebooksRelations,
    rulebookRequests,
    certApplications,
    certifications,
    sanctions,
    reports,
    staff,
    staffMemos,
    auditLog,
  },
});
