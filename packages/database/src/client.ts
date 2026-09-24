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

// prepare: false — required for Supabase's transaction-mode pooler.
// max — parallel queries per instance. The session pooler caps clients at pool_size (15) across
// every instance, so the admin app (session pooler) sets DATABASE_POOL_MAX lower.
// idle_timeout — release idle connections so pooler slots are not held forever.
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
