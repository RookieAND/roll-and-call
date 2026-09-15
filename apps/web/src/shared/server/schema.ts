import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
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

// 정원(maxPlayers)만큼 confirmed로 채우고 초과분은 waiting. 승격/강등/자동 승계는 이 값만 바꾼다.
export const participantStatus = pgEnum("participant_status", ["confirmed", "waiting"]);

// Mirror of auth.users, kept in sync by a trigger. `id` equals the Supabase auth uid.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  defaultSlots: text("default_slots").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
  images: text("images").array().notNull().default([]),
  playTime: text("play_time"),
  maxPlayers: integer("max_players").notNull(),
  // false면 정원이 찼을 때 대기 신청을 받지 않는다(status "full").
  waitlistEnabled: boolean("waitlist_enabled").notNull().default(true),
  scheduleMode: scheduleMode("schedule_mode").notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  rangeStart: date("range_start"),
  rangeEnd: date("range_end"),
  // both schedule modes route through here once the start is confirmed
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  // set when the 1h-before reminder has been sent (dedupe)
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  // 모집 공지 메시지에서 연 스레드라 id가 공지 메시지 id와 같다.
  discordThreadId: text("discord_thread_id"),
  // 직전 회차. null이면 1회차.
  parentGameId: uuid("parent_game_id").references((): AnyPgColumn => games.id, {
    onDelete: "set null",
  }),
  round: integer("round").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    status: participantStatus("status").notNull().default("confirmed"),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.userId] })],
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
    slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.userId, table.slotStart] })],
);

export const profilesRelations = relations(profiles, ({ many }) => ({
  hostedGames: many(games),
  participations: many(participants),
  availabilities: many(availabilities),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  gm: one(profiles, { fields: [games.gmId], references: [profiles.id] }),
  parent: one(games, {
    fields: [games.parentGameId],
    references: [games.id],
    relationName: "gameRounds",
  }),
  rounds: many(games, { relationName: "gameRounds" }),
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
