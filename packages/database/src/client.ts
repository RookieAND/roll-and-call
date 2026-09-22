import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
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
// max: 6 — lets one request run its Promise.all queries in parallel over the transaction pooler.
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 6 });

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
  },
});
