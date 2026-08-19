import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const scheduleMode = pgEnum("schedule_mode", ["fixed", "coordinate"]);

// Mirror of auth.users, kept in sync by a trigger. `id` equals the Supabase auth uid.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  // 한 줄 소개
  bio: text("bio"),
  // 기본 가능 시간대 preset keys (weekday_evening | weekend_day | weekend_evening)
  defaultSlots: text("default_slots").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  gmId: uuid("gm_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  rule: text("rule").notNull(),
  synopsis: text("synopsis"),
  thumbnailUrl: text("thumbnail_url"),
  playTime: text("play_time"),
  maxPlayers: integer("max_players").notNull(),
  scheduleMode: scheduleMode("schedule_mode").notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  // coordinate mode only: the When2Meet date range
  rangeStart: date("range_start"),
  rangeEnd: date("range_end"),
  // set once the session start is confirmed (both modes route through here)
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  // set when the 1h-before reminder has been sent (dedupe)
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const participants = pgTable(
  "participants",
  {
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.userId] })],
);

export const availabilities = pgTable(
  "availabilities",
  {
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    // one row per 30-min slot the user marked available (sparse)
    slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.userId, t.slotStart] })],
);

export const profilesRelations = relations(profiles, ({ many }) => ({
  hostedGames: many(games),
  participations: many(participants),
  availabilities: many(availabilities),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  gm: one(profiles, { fields: [games.gmId], references: [profiles.id] }),
  participants: many(participants),
  availabilities: many(availabilities),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  game: one(games, { fields: [participants.gameId], references: [games.id] }),
  user: one(profiles, {
    fields: [participants.userId],
    references: [profiles.id],
  }),
}));

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  game: one(games, {
    fields: [availabilities.gameId],
    references: [games.id],
  }),
  user: one(profiles, {
    fields: [availabilities.userId],
    references: [profiles.id],
  }),
}));

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
export type Availability = typeof availabilities.$inferSelect;
export type NewAvailability = typeof availabilities.$inferInsert;
