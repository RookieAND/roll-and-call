import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 룰북 추가 요청을 어떻게 끝냈는지. null이면 아직 대기 중이다.
export const rulebookRequestOutcome = pgEnum("rulebook_request_outcome", [
  "added",
  "linked",
  "rejected",
]);

// core는 GM에 필요한 기본 룰북, supplement는 기본 룰북 위에 더하는 책, handbook은 플레이어용이라 GM 자격이 되지 않는다.
export const rulebookKind = pgEnum("rulebook_kind", ["core", "supplement", "handbook"]);

// 같은 TRPG의 책을 묶는다. 단권 룰도 카테고리 하나에 책 하나다.
// 룰북 목록은 서버마다 따로 두고, 새 서버는 trpia의 목록을 복사해 시작한다(copy_default_rulebooks, 퀴즈 제외).
export const rulebookCategories = pgTable(
  "rulebook_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("rulebook_categories_server_id_name_unique").on(table.serverId, table.name),
  ],
).enableRLS();

// 책 한 권이 한 행이다. 같은 카테고리·판본의 core를 모두 가져야 그 판본으로 GM을 설 수 있고,
// supersedesId는 이 책이 대신하는 구판이다(7판 → 6판). 구인·인증은 "이름 판본"으로 부른다.
export const rulebooks = pgTable(
  "rulebooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => rulebookCategories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    edition: text("edition").notNull().default(""),
    kind: rulebookKind("kind").notNull().default("core"),
    supersedesId: uuid("supersedes_id").references((): AnyPgColumn => rulebooks.id, {
      onDelete: "set null",
    }),
    aliases: text("aliases").array().notNull().default([]),
    certRequired: boolean("cert_required").notNull().default(true),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("rulebooks_server_id_name_edition_unique").on(
      table.serverId,
      table.name,
      table.edition,
    ),
    index("rulebooks_category_id_idx").on(table.categoryId),
  ],
).enableRLS();

export const rulebookRequests = pgTable(
  "rulebook_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    edition: text("edition").notNull().default(""),
    publisher: text("publisher"),
    note: text("note").notNull().default(""),
    // 비어 있으면 "잘 모르겠음". 서플리먼트·핸드북이면 어느 룰의 책인지 목록에서 고르거나(categoryId) 적는다(categoryName).
    kind: rulebookKind("kind"),
    categoryId: uuid("category_id").references(() => rulebookCategories.id, {
      onDelete: "set null",
    }),
    categoryName: text("category_name"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    outcome: rulebookRequestOutcome("outcome"),
    processedBy: uuid("processed_by").references(() => profiles.id, { onDelete: "set null" }),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    // 반려할 때 요청자에게 보이는 사유. 내 룰북에 처리 뒤 30일 보인다
    rejectReason: text("reject_reason"),
  },
  (table) => [
    index("rulebook_requests_user_id_idx").on(table.userId),
    check("rulebook_requests_reject_reason_length", sql`char_length(${table.rejectReason}) <= 200`),
  ],
).enableRLS();

// 본문 퀴즈 문항은 서버마다 따로 둔다. 인증 신청 때 사용 중인 문항 하나를 내고, 답은 answers 가운데 하나면 맞다(공백·대소문자 무시).
// 출제된 문항은 지우지 않고 active를 끈다.
export const rulebookQuizQuestions = pgTable(
  "rulebook_quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    rulebookId: uuid("rulebook_id")
      .notNull()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answers: text("answers").array().notNull().default([]),
    page: text("page").notNull().default(""),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("rulebook_quiz_questions_rulebook_id_idx").on(table.rulebookId)],
).enableRLS();

// 전자책 인증에서 고르는 판매처. 서버마다 따로 두고, 목록에 없으면 신청자가 적은 이름이 그대로 들어간다.
export const certSellers = pgTable(
  "cert_sellers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("cert_sellers_server_id_name_unique").on(table.serverId, table.name)],
).enableRLS();

export type Rulebook = typeof rulebooks.$inferSelect;

export type RulebookKind = (typeof rulebookKind.enumValues)[number];
