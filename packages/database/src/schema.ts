import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
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
  (table) => [
    primaryKey({ columns: [table.ownerId, table.targetId] }),
    // 프로필 삭제 시 cascade가 target_id로 찾는다.
    index("profile_memos_target_id_idx").on(table.targetId),
  ],
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
    index("games_gm_id_idx").on(table.gmId),
    index("games_end_date_idx").on(table.endDate),
    index("games_rulebook_id_idx").on(table.rulebookId),
    // 확정된 세션만 본다(달력·리마인더·시간 겹침 검사). null은 전체의 대부분이라 부분 인덱스로 뺀다.
    index("games_confirmed_at_idx")
      .on(table.confirmedAt)
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
    // PK가 game_id로 시작해 user_id 단독 조회(내가 신청한 게임)는 못 탄다.
    index("participants_user_id_idx").on(table.userId),
    // 한 게임 안에서 1d100 값은 사람마다 다르다. null(굴리기 전)끼리는 겹쳐도 된다.
    uniqueIndex("participants_game_id_draw_roll_unique").on(table.gameId, table.drawRoll),
    check("participants_draw_roll_range", sql`${table.drawRoll} between 1 and 100`),
    check("participants_draw_rank_positive", sql`${table.drawRank} >= 1`),
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
  (table) => [
    primaryKey({ columns: [table.gameId, table.userId, table.slotStart] }),
    // 내가 응답한 게임(user_id → distinct game_id)을 인덱스만으로 끝낸다.
    index("availabilities_user_id_game_id_idx").on(table.userId, table.gameId),
  ],
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

// ── 어드민 ──
// 아래 테이블은 모두 RLS만 켜고 정책을 두지 않는다. 어드민 서버(DATABASE_URL)만 읽고 쓴다.

export const staffRole = pgEnum("staff_role", ["owner", "staff"]);

export const certApplicationStatus = pgEnum("cert_application_status", [
  "pending",
  "approved",
  "rejected",
]);

// 룰북 추가 요청을 어떻게 끝냈는지. null이면 아직 대기 중이다.
export const rulebookRequestOutcome = pgEnum("rulebook_request_outcome", [
  "added",
  "linked",
  "rejected",
]);

export type CertShot = "full" | "front" | "back" | "side";

// 추가 정보(before/after/related)는 활동 기록 상세에만 쓰므로 jsonb 한 칸에 담는다.
export type AuditState = { label: string; sub?: string };

// 구인·인증은 "이름 판본"으로 룰북을 부른다. aliases는 구인의 자유 입력 룰을 이 룰북으로 맞출 때도 쓴다.
export const rulebooks = pgTable(
  "rulebooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    edition: text("edition").notNull().default(""),
    aliases: text("aliases").array().notNull().default([]),
    certRequired: boolean("cert_required").notNull().default(true),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("rulebooks_name_edition_unique").on(table.name, table.edition)],
).enableRLS();

export const rulebookRequests = pgTable(
  "rulebook_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    outcome: rulebookRequestOutcome("outcome"),
    processedBy: uuid("processed_by").references(() => profiles.id, { onDelete: "set null" }),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => [index("rulebook_requests_user_id_idx").on(table.userId)],
).enableRLS();

// 한 사람이 같은 룰북을 여러 번 신청할 수 있다. 반려된 이전 신청이 재신청 이력이다.
export const certApplications = pgTable(
  "cert_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rulebookId: uuid("rulebook_id")
      .notNull()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    memo: text("memo").notNull().default(""),
    photoUrls: jsonb("photo_urls").$type<Partial<Record<CertShot, string>>>().notNull().default({}),
    // 재신청에서 이전 신청과 달라진 사진.
    replacedShots: text("replaced_shots").array().$type<CertShot[]>().notNull().default([]),
    status: certApplicationStatus("status").notNull().default("pending"),
    rejectTag: text("reject_tag"),
    rejectReason: text("reject_reason"),
    flaggedShots: text("flagged_shots").array().$type<CertShot[]>().notNull().default([]),
    processedBy: uuid("processed_by").references(() => profiles.id, { onDelete: "set null" }),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("cert_applications_user_id_idx").on(table.userId),
    index("cert_applications_rulebook_id_idx").on(table.rulebookId),
    // 심사 대기열은 대기 중인 신청만 본다.
    index("cert_applications_pending_idx")
      .on(table.createdAt)
      .where(sql`status = 'pending'`),
  ],
).enableRLS();

export const certifications = pgTable(
  "certifications",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rulebookId: uuid("rulebook_id")
      .notNull()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    approvedBy: uuid("approved_by").references(() => profiles.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.rulebookId] }),
    index("certifications_rulebook_id_idx").on(table.rulebookId),
  ],
).enableRLS();

// 해제하면 지우지 않고 released_at을 채운다. until이 null이면 무기한이다.
export const sanctions = pgTable(
  "sanctions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    reason: text("reason").notNull(),
    until: timestamp("until", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    releasedBy: uuid("released_by").references(() => profiles.id, { onDelete: "set null" }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
  },
  (table) => [
    // 해제 안 된 제재는 한 사람에 하나뿐이다. 동시에 두 운영진이 제재해도 한 건만 들어간다.
    uniqueIndex("sanctions_active_user_unique")
      .on(table.userId)
      .where(sql`released_at is null`),
  ],
).enableRLS();

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id").references(() => profiles.id, { onDelete: "set null" }),
    category: text("category").notNull(),
    detail: text("detail").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedBy: uuid("resolved_by").references(() => profiles.id, { onDelete: "set null" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("reports_game_id_idx").on(table.gameId)],
).enableRLS();

// 역할은 이 표가 정한다. 환경변수 ADMIN_OWNER_DISCORD_IDS는 표가 비어 있을 때 첫 소유자를 들이는 입구다.
export const staff = pgTable("staff", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  role: staffRole("role").notNull().default("staff"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const staffMemos = pgTable(
  "staff_memos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    authorId: uuid("author_id").references(() => profiles.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("staff_memos_user_id_idx").on(table.userId)],
).enableRLS();

// target은 기록 당시의 문구를 그대로 남긴다. 이름이 바뀌어도 기록은 그때 모습으로 읽힌다.
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    target: text("target").notNull(),
    targetUserId: uuid("target_user_id").references(() => profiles.id, { onDelete: "set null" }),
    targetGameId: uuid("target_game_id").references(() => games.id, { onDelete: "set null" }),
    reason: text("reason").notNull().default(""),
    reasonTag: text("reason_tag"),
    staffMemo: text("staff_memo"),
    before: jsonb("before").$type<AuditState>(),
    after: jsonb("after").$type<AuditState>(),
    related: text("related").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_log_created_at_idx").on(table.createdAt),
    index("audit_log_target_game_id_idx").on(table.targetGameId),
  ],
).enableRLS();

// 한 줄짜리 설정 표. id가 늘 true라 두 번째 줄이 생기지 않는다.
export const adminSettings = pgTable(
  "admin_settings",
  {
    id: boolean("id").primaryKey().default(true),
    certEnforcementDate: timestamp("cert_enforcement_date", { withTimezone: true }),
  },
  (table) => [check("admin_settings_single_row", sql`${table.id}`)],
).enableRLS();

export type Rulebook = typeof rulebooks.$inferSelect;
export type CertApplication = typeof certApplications.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
