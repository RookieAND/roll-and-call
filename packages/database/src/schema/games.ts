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
  smallint,
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

// first_come은 정원까지 신청 순서대로 확정하고, lottery는 정원과 무관하게 받아 마감 때 1d100 추첨으로 확정 인원을 정한다.
// selection은 정원과 무관하게 받고 GM이 신청자 중에서 확정자를 직접 골라 [선발 마치기]로 끝낸다.
export const recruitMethod = pgEnum("recruit_method", ["first_come", "lottery", "selection"]);

// 정원(maxPlayers)만큼 confirmed로 채우고 초과분은 waiting. 승격/강등/자동 승계는 이 값만 바꾼다.
// removed는 세션 시작 뒤 불참으로 내보낸 사람이다. 행을 남기고 absent = true로 두며 확정 인원·정원에 세지 않는다.
// removed는 ALTER TYPE ... ADD VALUE로 더했다. 같은 트랜잭션에서는 쓸 수 없고 drizzle-kit migrate는 밀린 마이그레이션을
// 한 트랜잭션으로 돌리므로, removed를 SQL에서 쓰는 마이그레이션은 이 값을 더한 마이그레이션을 적용한 뒤에 따로 돌린다.
// briefing은 설명회, session은 일반 세션. 신청자가 생기기 전에만 바꿀 수 있다.
export const gameKind = pgEnum("game_kind", ["briefing", "session"]);

// 설명회는 voice로 고정한다.
export const playType = pgEnum("play_type", ["voice", "text"]);

export const participantStatus = pgEnum("participant_status", ["confirmed", "waiting", "removed"]);

// 구인을 누가 취소했는지. auto는 GM이 디스코드 서버를 나가 자동으로 취소된 경우다.
export const gameCancelKind = pgEnum("game_cancel_kind", [
  "gm",
  "staff",
  "auto",
  "min_players_unmet",
  "selection_expired",
]);

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    gmId: uuid("gm_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    title: text("title").notNull(),
    kind: gameKind("kind").notNull().default("session"),
    playType: playType("play_type").notNull().default("voice"),
    rule: text("rule").notNull(),
    // rule 글자를 룰북 이름·다른 이름에 맞춰 트리거가 채운다. 맞는 룰북이 없으면 null.
    rulebookId: uuid("rulebook_id").references(() => rulebooks.id, { onDelete: "set null" }),
    synopsis: text("synopsis"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailSpoiler: boolean("thumbnail_spoiler").notNull().default(false),
    images: text("images").array().notNull().default([]),
    // 플레이 시간의 유일한 값(분). 종료 시각 판별과 화면 표기가 모두 이 값을 쓴다.
    playMinutes: integer("play_minutes"),
    // 신청 전에 알아야 할 것들. 각각 최대 5개이고 순서를 그대로 보여준다.
    genres: text("genres").array().notNull().default([]),
    triggers: text("triggers").array().notNull().default([]),
    platforms: text("platforms").array().notNull().default([]),
    notice: text("notice"),
    // 세션 진행 중 AI 이미지를 쓸 수 있는지. 등록할 때 반드시 고르고, 목록에는 내보내지 않는다.
    aiImage: boolean("ai_image").notNull().default(false),
    maxPlayers: integer("max_players").notNull(),
    // 선택 입력. 모집 마감 때 모인 인원이 이보다 적으면 구인이 자동 취소된다. 1 이상 정원 이하.
    minPlayers: integer("min_players"),
    // 마감 판정을 이미 한 시각. 판정은 한 번만 하고, 마감을 미래로 고치면 비운다.
    minPlayersJudgedAt: timestamp("min_players_judged_at", { withTimezone: true }),
    recruitMethod: recruitMethod("recruit_method").notNull().default("first_come"),
    // false면 정원이 찼을 때 대기 신청을 받지 않는다(status "full"). 선착순에서만 쓴다.
    waitlistEnabled: boolean("waitlist_enabled").notNull().default(true),
    // true면 신청할 때 신청글을 필수로 받는다. 신청자가 한 명이라도 있으면 바꿀 수 없다.
    applicationNoteEnabled: boolean("application_note_enabled").notNull().default(false),
    scheduleMode: scheduleMode("schedule_mode").notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    rangeStart: date("range_start"),
    rangeEnd: date("range_end"),
    // both schedule modes route through here once the start is confirmed
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    // 조율형 격자의 하루 범위. 일시 지정형은 쓰지 않는다. 끝이 시작 이하면 자정을 넘긴다.
    windowStartHour: smallint("window_start_hour").notNull().default(12),
    // 조율형 격자의 하루 범위. 일시 지정형은 쓰지 않는다. 끝이 시작 이하면 자정을 넘긴다.
    windowEndHour: smallint("window_end_hour").notNull().default(0),
    // set when the 1h-before reminder has been sent (dedupe)
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    // 추첨을 돌린 시각. 값이 있으면 신청을 받지 않고, 확정·대기 명단은 이미 정해진 뒤다.
    // 신청자 0명으로 마감된 추첨 글도 값이 있다(굴린 값 없음).
    drawnAt: timestamp("drawn_at", { withTimezone: true }),
    // GM이 [선발 마치기]로 선발을 끝낸 시각. 선발 글이 아니면 항상 null이다.
    selectionFinishedAt: timestamp("selection_finished_at", { withTimezone: true }),
    // GM이 참석 여부를 확정한 시각. null이면 세션이 끝났어도 아직 출석 확인이 남아 있다.
    attendanceConfirmedAt: timestamp("attendance_confirmed_at", { withTimezone: true }),
    // 출석을 처음 확정한 시각(GM이든 자동이든). 후기 작성 7일 기준이고, attendanceConfirmedAt은 마지막 확정 시각이다.
    attendanceFirstConfirmedAt: timestamp("attendance_first_confirmed_at", { withTimezone: true }),
    // GM이 세션 마치기를 누른 시각. null이면 시작 + 플레이타임이 종료다.
    endedAt: timestamp("ended_at", { withTimezone: true }),
    // 세션 종료 안내를 스레드에 올린 시각(한 번만 보내는 표시). 끝난 세션을 먼저 이 값으로 집어 간다.
    endNotifiedAt: timestamp("end_notified_at", { withTimezone: true }),
    // 세션 시작 뒤 정원을 1명 늘린 시각. 구인당 한 번만 늘릴 수 있고 늘린 값은 maxPlayers에 들어간다.
    capacityRaisedAt: timestamp("capacity_raised_at", { withTimezone: true }),
    // 모집 공지 메시지에서 연 스레드라 id가 공지 메시지 id와 같다.
    discordThreadId: text("discord_thread_id"),
    // 운영진 조치. 숨긴 구인은 사용자 앱의 목록·검색에서만 빠진다.
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    hiddenBy: uuid("hidden_by").references(() => profiles.id, { onDelete: "set null" }),
    // 사유 코드(CONTENT_REASON 키)와 기타일 때 입력한 글. 보이는 글은 reasonLabel로 만든다.
    hiddenReasonCode: text("hidden_reason_code"),
    hiddenReasonText: text("hidden_reason_text"),
    // 취소한 구인은 지우지 않고 남겨 신청·수정·명단 조정만 막는다. 사유는 GM이 취소할 때만 남긴다.
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancelledBy: uuid("cancelled_by").references(() => profiles.id, { onDelete: "set null" }),
    cancelKind: gameCancelKind("cancel_kind"),
    cancelReason: text("cancel_reason"),
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
    // 마감 때 추첨 크론이 집는 글
    index("games_lottery_due_idx")
      .on(table.endDate)
      .where(sql`recruit_method = 'lottery' and drawn_at is null and cancelled_at is null`),
    // 마감 때 최소 인원 판정 크론이 집는 글
    index("games_min_players_due_idx")
      .on(table.endDate)
      .where(
        sql`recruit_method = 'first_come' and min_players is not null and min_players_judged_at is null and cancelled_at is null`,
      ),
    check("games_briefing_voice", sql`${table.kind} <> 'briefing' or ${table.playType} = 'voice'`),
    check("games_max_players_positive", sql`${table.maxPlayers} >= 1`),
    check(
      "games_min_players_range",
      sql`${table.minPlayers} is null or (${table.minPlayers} >= 1 and ${table.minPlayers} <= ${table.maxPlayers})`,
    ),
    check("games_play_minutes_positive", sql`${table.playMinutes} > 0`),
    check(
      "games_window_hours",
      sql`${table.windowStartHour} between 0 and 23 and ${table.windowEndHour} between 0 and 23 and ${table.windowStartHour} <> ${table.windowEndHour}`,
    ),
    check("games_range_order", sql`${table.rangeEnd} >= ${table.rangeStart}`),
    check(
      "games_tag_limits",
      sql`cardinality(${table.genres}) <= 5 and cardinality(${table.triggers}) <= 10 and cardinality(${table.platforms}) <= 5`,
    ),
    check("games_cancel_reason_length", sql`char_length(${table.cancelReason}) <= 200`),
    check(
      "games_cancelled_has_kind",
      sql`${table.cancelledAt} is null or ${table.cancelKind} is not null`,
    ),
    check(
      "games_ended_after_start",
      sql`${table.endedAt} is null or (${table.confirmedAt} is not null and ${table.endedAt} >= ${table.confirmedAt})`,
    ),
    check(
      "games_attendance_first_confirmed",
      sql`${table.attendanceFirstConfirmedAt} is null or ${table.attendanceConfirmedAt} is not null`,
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
    // 추첨에서 굴린 1d100. 추첨 명령이 drawRank·status와 함께 한 번에 쓴다.
    drawRoll: integer("draw_roll"),
    // 기본값이 전원 참석이라 GM이 출석을 확정할 때 예외만 true가 된다.
    absent: boolean("absent").notNull().default(false),
    // 운영진이 불참 기록을 취소한 흔적. absent는 GM이 적은 그대로 두고, 이 값이 있으면 불참으로 세지 않는다.
    absenceCancelledAt: timestamp("absence_cancelled_at", { withTimezone: true }),
    absenceCancelledBy: uuid("absence_cancelled_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    absenceCancelReason: text("absence_cancel_reason"),
    // 대기가 된 시각. 같은 시각끼리는 drawRank, 그다음 joinedAt 순서다. 확정 상태에서는 의미가 없다.
    waitlistedAt: timestamp("waitlisted_at", { withTimezone: true }),
    // 신청글 받기 구인에서 신청자가 쓴 글. GM만 볼 수 있고 신청을 취소하면 행과 함께 지워진다.
    applicationNote: text("application_note"),
    // 본인이 조율표를 저장한 마지막 시각. 서버가 기본 가능 시간을 자동 저장한 것은 제출로 치지 않는다(R15).
    availabilitySubmittedAt: timestamp("availability_submitted_at", { withTimezone: true }),
    // GM이 불참으로 내보내거나 출석에서 불참으로 고를 때 적는 사유. 운영진만 본다.
    absenceReason: text("absence_reason"),
    // 운영진이 출석을 불참으로 바꾼 불참 기록 추가. 태그는 gm_request·member_confirmed·other다.
    absenceAddedAt: timestamp("absence_added_at", { withTimezone: true }),
    absenceAddedBy: uuid("absence_added_by").references(() => profiles.id, {
      onDelete: "set null",
    }),
    absenceAddedTag: text("absence_added_tag"),
    absenceAddedReason: text("absence_added_reason"),
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
    check(
      "participants_application_note_length",
      sql`char_length(${table.applicationNote}) <= 500`,
    ),
    check("participants_absence_reason_length", sql`char_length(${table.absenceReason}) <= 200`),
    check(
      "participants_absence_added_tag",
      sql`${table.absenceAddedTag} is null or ${table.absenceAddedTag} in ('gm_request', 'member_confirmed', 'other')`,
    ),
    check(
      "participants_absence_added_complete",
      sql`${table.absenceAddedAt} is null or ${table.absenceAddedTag} is not null`,
    ),
    check(
      "participants_absence_added_other_reason",
      sql`${table.absenceAddedTag} is distinct from 'other' or ${table.absenceAddedReason} is not null`,
    ),
    check(
      "participants_absence_added_reason_length",
      sql`char_length(${table.absenceAddedReason}) <= 200`,
    ),
  ],
);

// status에는 removed를 쓰지 않는다(participants와 같은 enum이라 DB로는 막지 않는다).
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
    index("draw_results_user_id_idx").on(table.userId),
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
