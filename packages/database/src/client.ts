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
    profilesRelations,
    gamesRelations,
    participantsRelations,
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
