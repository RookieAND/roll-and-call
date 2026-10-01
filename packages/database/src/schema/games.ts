import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { rulebooks } from "./rulebooks";
import { serverId } from "./server-id";

export const scheduleMode = pgEnum("schedule_mode", ["fixed", "coordinate"]);

// first_come은 정원까지 신청 순서대로 확정하고, lottery는 정원과 무관하게 받아 GM이 확정 인원을 고른다.
export const recruitMethod = pgEnum("recruit_method", ["first_come", "lottery"]);

// 정원(maxPlayers)만큼 confirmed로 채우고 초과분은 waiting. 승격/강등/자동 승계는 이 값만 바꾼다.
export const participantStatus = pgEnum("participant_status", ["confirmed", "waiting"]);

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    gmId: uuid("gm_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    title: text("title").notNull(),
    rule: text("rule").notNull(),
    // rule 글자를 룰북 이름·다른 이름에 맞춰 트리거가 채운다. 맞는 룰북이 없으면 null.
    rulebookId: uuid("rulebook_id").references(() => rulebooks.id, { onDelete: "set null" }),
    synopsis: text("synopsis"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailSpoiler: boolean("thumbnail_spoiler").notNull().default(false),
    images: text("images").array().notNull().default([]),
    playTime: text("play_time"),
    // 종료 시각 판별용 길이(분). playTime 원문은 사람이 읽는 값이라 파싱이 어긋나면 여기를 손으로 고친다.
    playMinutes: integer("play_minutes"),
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
    // GM이 참석 여부를 확정한 시각. null이면 세션이 끝났어도 아직 출석 확인이 남아 있다.
    attendanceConfirmedAt: timestamp("attendance_confirmed_at", { withTimezone: true }),
    // 모집 공지 메시지에서 연 스레드라 id가 공지 메시지 id와 같다.
    discordThreadId: text("discord_thread_id"),
    // 운영진 조치. 숨긴 구인은 사용자 앱의 목록·검색에서만 빠진다.
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    hiddenBy: uuid("hidden_by").references(() => profiles.id, { onDelete: "set null" }),
    hiddenReason: text("hidden_reason"),
    editRequestedAt: timestamp("edit_requested_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // 게임에 딸린 표가 (game_id, server_id) 복합 FK로 같은 서버인지 확인한다.
    unique("games_id_server_id_unique").on(table.id, table.serverId),
    index("games_gm_id_idx").on(table.gmId),
    index("games_server_id_end_date_idx").on(table.serverId, table.endDate),
    index("games_rulebook_id_idx").on(table.rulebookId),
    // 확정된 세션만 본다(달력·리마인더·시간 겹침 검사). null은 전체의 대부분이라 부분 인덱스로 뺀다.
    index("games_server_id_confirmed_at_idx")
      .on(table.serverId, table.confirmedAt)
      .where(sql`confirmed_at is not null`),
    check("games_max_players_positive", sql`${table.maxPlayers} >= 1`),
    check("games_play_minutes_positive", sql`${table.playMinutes} > 0`),
    check("games_range_order", sql`${table.rangeEnd} >= ${table.rangeStart}`),
    check(
      "games_tag_limits",
      sql`cardinality(${table.genres}) <= 5 and cardinality(${table.triggers}) <= 5 and cardinality(${table.platforms}) <= 5`,
    ),
  ],
);

export const participants = pgTable(
  "participants",
  {
    serverId: serverId(),
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
    // 추첨에서 굴린 1d100. GM이 결과를 적용하기 전에는 이 값만 있고 drawRank·status는 그대로다.
    drawRoll: integer("draw_roll"),
    // 기본값이 전원 참석이라 GM이 출석을 확정할 때 예외만 true가 된다.
    absent: boolean("absent").notNull().default(false),
    // 운영진이 불참 기록을 취소한 흔적. absent는 GM이 적은 그대로 두고, 이 값이 있으면 불참으로 세지 않는다.
    absenceCancelledAt: timestamp("absence_cancelled_at", { withTimezone: true }),
    absenceCancelledBy: uuid("absence_cancelled_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    absenceCancelReason: text("absence_cancel_reason"),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.userId] }),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "participants_game_server_fk",
    }).onDelete("cascade"),
    // PK가 game_id로 시작해 user_id 단독 조회(내가 신청한 게임)는 못 탄다.
    index("participants_user_id_idx").on(table.userId),
    // 한 게임 안에서 1d100 값은 사람마다 다르다. null(굴리기 전)끼리는 겹쳐도 된다.
    uniqueIndex("participants_game_id_draw_roll_unique").on(table.gameId, table.drawRoll),
    check("participants_draw_roll_range", sql`${table.drawRoll} between 1 and 100`),
    check("participants_draw_rank_positive", sql`${table.drawRank} >= 1`),
  ],
);

// 추첨을 적용한 순간의 명단. 뒤에 누가 나가거나 순번이 바뀌어도 추첨 결과 페이지는 이 기록을 보여 준다.
// roll이 null이면 추첨 전에 직접 확정한 사람이다.
export const drawResults = pgTable(
  "draw_results",
  {
    serverId: serverId(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    roll: integer("roll"),
    status: participantStatus("status").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.userId] }),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "draw_results_game_server_fk",
    }).onDelete("cascade"),
    check("draw_results_roll_range", sql`${table.roll} between 1 and 100`),
  ],
).enableRLS();

export const availabilities = pgTable(
  "availabilities",
  {
    serverId: serverId(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.userId, table.slotStart] }),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "availabilities_game_server_fk",
    }).onDelete("cascade"),
    // 내가 응답한 게임(user_id → distinct game_id)을 인덱스만으로 끝낸다.
    index("availabilities_user_id_game_id_idx").on(table.userId, table.gameId),
  ],
);

export type Game = typeof games.$inferSelect;

export type NewGame = typeof games.$inferInsert;

export type Participant = typeof participants.$inferSelect;

export type NewParticipant = typeof participants.$inferInsert;

export type Availability = typeof availabilities.$inferSelect;

export type NewAvailability = typeof availabilities.$inferInsert;
