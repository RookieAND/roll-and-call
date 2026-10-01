import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { games } from "./games";
import { profiles } from "./profiles";
import { serverId } from "./server-id";

export const staffRole = pgEnum("staff_role", ["owner", "staff"]);

// 추가 정보(before/after/related)는 활동 기록 상세에만 쓰므로 jsonb 한 칸에 담는다.
export type AuditState = { label: string; sub?: string };

// 해제하면 지우지 않고 released_at을 채운다. until이 null이면 무기한이다.
export const sanctions = pgTable(
  "sanctions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
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
    uniqueIndex("sanctions_active_server_user_unique")
      .on(table.serverId, table.userId)
      .where(sql`released_at is null`),
  ],
).enableRLS();

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
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
  (table) => [
    index("reports_game_id_idx").on(table.gameId),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "reports_game_server_fk",
    }).onDelete("cascade"),
  ],
).enableRLS();

// 역할은 이 표가 서버마다 정한다. 환경변수 ADMIN_OWNER_DISCORD_IDS는 표가 비어 있을 때 첫 소유자를 들이는 입구다.
export const staff = pgTable(
  "staff",
  {
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    role: staffRole("role").notNull().default("staff"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.userId] }),
    index("staff_user_id_idx").on(table.userId),
  ],
).enableRLS();

export const staffMemos = pgTable(
  "staff_memos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
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
    serverId: serverId(),
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
    index("audit_log_server_id_created_at_idx").on(table.serverId, table.createdAt),
    index("audit_log_target_game_id_idx").on(table.targetGameId),
  ],
).enableRLS();

// servers.cert_enforcement_date로 옮겨 더 읽고 쓰지 않는다. 다음 단계에서 지운다.
export const adminSettings = pgTable(
  "admin_settings",
  {
    id: boolean("id").primaryKey().default(true),
    certEnforcementDate: timestamp("cert_enforcement_date", { withTimezone: true }),
  },
  (table) => [check("admin_settings_single_row", sql`${table.id}`)],
).enableRLS();

export type AuditLogEntry = typeof auditLog.$inferSelect;
