import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const scheduleMode = pgEnum("schedule_mode", ["fixed", "coordinate"]);

// first_come은 정원까지 신청 순서대로 확정하고, lottery는 정원과 무관하게 받아 GM이 확정 인원을 고른다.
export const recruitMethod = pgEnum("recruit_method", ["first_come", "lottery"]);

// 정원(maxPlayers)만큼 confirmed로 채우고 초과분은 waiting. 승격/강등/자동 승계는 이 값만 바꾼다.
export const participantStatus = pgEnum("participant_status", ["confirmed", "waiting"]);

// 본인이 적는 성향. 서버에서 정규화해 넣으므로 읽는 화면은 다시 다듬지 않는다.
export type ProfileKeyword = string;

// 요일 하나에 구간 목록. day는 0=월 … 6=일, from·to는 1시간 단위 시각(0~24).
export type AvailabilityInterval = { day: number; from: number; to: number };

// service는 link-services의 키, value는 핸들이나 주소 원문.
export type ProfileLink = { service: string; value: string };

// Mirror of auth.users, kept in sync by a trigger. `id` equals the Supabase auth uid.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  keywords: text("keywords").array().notNull().default([]),
  availability: jsonb("availability").$type<AvailabilityInterval[]>().notNull().default([]),
  links: jsonb("links").$type<ProfileLink[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 쓴 사람만 본다. 상대는 내용도, 메모가 있다는 사실도 볼 수 없다.
export const profileMemos = pgTable(
  "profile_memos",
  {
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    targetId: uuid("target_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    body: text("body").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.ownerId, table.targetId] })],
);

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gmId: uuid("gm_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    title: text("title").notNull(),
    rule: text("rule").notNull(),
    synopsis: text("synopsis"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailSpoiler: boolean("thumbnail_spoiler").notNull().default(false),
    images: text("images").array().notNull().default([]),
    playTime: text("play_time"),
    // 신청 전에 알아야 할 것들. 각각 최대 5개이고 순서를 그대로 보여준다.
    genres: text("genres").array().notNull().default([]),
    triggers: text("triggers").array().notNull().default([]),
    platforms: text("platforms").array().notNull().default([]),
    notice: text("notice"),
    // 세션 진행 중 AI 이미지를 쓸 수 있는지. 등록할 때 반드시 고르고, 목록에는 내보내지 않는다.
    aiImage: boolean("ai_image").notNull().default(false),
    maxPlayers: integer("max_players").notNull(),
    recruitMethod: recruitMethod("recruit_method").notNull().default("first_come"),
    // false면 정원이 찼을 때 대기 신청을 받지 않는다(status "full"). 선착순에서만 쓴다.
    waitlistEnabled: boolean("waitlist_enabled").notNull().default(true),
    scheduleMode: scheduleMode("schedule_mode").notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    rangeStart: date("range_start"),
    rangeEnd: date("range_end"),
    // both schedule modes route through here once the start is confirmed
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    // set when the 1h-before reminder has been sent (dedupe)
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    // 추첨을 돌린 시각. 값이 있으면 신청을 받지 않고, 확정·대기 명단은 이미 정해진 뒤다.
    drawnAt: timestamp("drawn_at", { withTimezone: true }),
    // 모집 공지 메시지에서 연 스레드라 id가 공지 메시지 id와 같다.
    discordThreadId: text("discord_thread_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("games_gm_id_idx").on(table.gmId),
    index("games_end_date_idx").on(table.endDate),
    // 확정된 세션만 본다(달력·리마인더·시간 겹침 검사). null은 전체의 대부분이라 부분 인덱스로 뺀다.
    index("games_confirmed_at_idx")
      .on(table.confirmedAt)
      .where(sql`confirmed_at is not null`),
  ],
);

export const participants = pgTable(
  "participants",
  {
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    status: participantStatus("status").notNull().default("confirmed"),
    // 추첨이 정한 순서. 선착순이거나 뽑기 전이면 null이고, 그때는 joinedAt이 순서다.
    drawRank: integer("draw_rank"),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.userId] }),
    // PK가 game_id로 시작해 user_id 단독 조회(내가 신청한 게임)는 못 탄다.
    index("participants_user_id_idx").on(table.userId),
  ],
);

export const availabilities = pgTable(
  "availabilities",
  {
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
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
export type ProfileMemo = typeof profileMemos.$inferSelect;
