import { sql } from "drizzle-orm";
import {
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

// 운영진 칸에 플랫폼 관리자 배지를 붙이거나 '시스템'으로 적을 때 쓴다.
export const auditActorKind = pgEnum("audit_actor_kind", ["staff", "platform", "system"]);

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
    // 사유 코드(USER_ACTION_REASON 키)와 기타일 때 입력한 글. 보이는 글은 reasonLabel로 만든다.
    reasonCode: text("reason_code").notNull(),
    reasonText: text("reason_text"),
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

// 서버장이 지정한 운영진. 소유자는 servers.owner_discord_id(디스코드 서버장)가 정하고, 이 표의 owner 역할은 서버장을 아직 못 읽은 서버에서만 쓴다.
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
    actorKind: auditActorKind("actor_kind").notNull().default("staff"),
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

export type AuditLogEntry = typeof auditLog.$inferSelect;
