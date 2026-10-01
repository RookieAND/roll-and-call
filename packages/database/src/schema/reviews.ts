import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { games } from "./games";
import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 출석을 확정한 세션에 참석한 확정 참여자가 한 번 쓴다. 작성자가 지워도 행을 남겨 다시 쓰지 못하게 한다.
// removed_by가 null이면 작성자가 지운 것이고, 운영진이 지우면 본문을 비운다.
// 숨김·제거되지 않았고 작성자가 지금 불참이 아니면 누구나 본다.
export const sessionReviews = pgTable(
  "session_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    body: text("body").notNull(),
    spoiler: boolean("spoiler").notNull().default(false),
    // review-photos 버킷의 공개 URL. 배열 순서가 보이는 순서다.
    photoUrls: text("photo_urls").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    hiddenBy: uuid("hidden_by").references(() => profiles.id, { onDelete: "set null" }),
    hiddenReason: text("hidden_reason"),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    removedBy: uuid("removed_by").references(() => profiles.id, { onDelete: "set null" }),
    removedReason: text("removed_reason"),
    // 세션후기 포럼 게시글(스레드) id. 공개가 아니게 되면 게시글을 지우고 비운다.
    discordThreadId: text("discord_thread_id"),
  },
  (table) => [
    uniqueIndex("session_reviews_game_id_author_id_unique").on(table.gameId, table.authorId),
    unique("session_reviews_id_server_id_unique").on(table.id, table.serverId),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "session_reviews_game_server_fk",
    }).onDelete("cascade"),
    index("session_reviews_author_id_idx").on(table.authorId),
    check(
      "session_reviews_body_length",
      sql`${table.removedAt} is not null or char_length(${table.body}) between 20 and 2000`,
    ),
    check("session_reviews_photo_limit", sql`cardinality(${table.photoUrls}) <= 5`),
  ],
).enableRLS();

export const reviewReportOutcome = pgEnum("review_report_outcome", [
  "dismissed",
  "hidden",
  "removed",
]);

// outcome이 null이면 처리 전이다. 운영진이 후기를 처리하면 그 후기의 남은 신고가 모두 같은 결과로 닫힌다.
export const reviewReports = pgTable(
  "review_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => sessionReviews.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id").references(() => profiles.id, { onDelete: "set null" }),
    category: text("category").notNull(),
    // category가 other일 때만 적는다.
    detail: text("detail").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    outcome: reviewReportOutcome("outcome"),
    resolvedBy: uuid("resolved_by").references(() => profiles.id, { onDelete: "set null" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("review_reports_review_id_idx").on(table.reviewId),
    foreignKey({
      columns: [table.reviewId, table.serverId],
      foreignColumns: [sessionReviews.id, sessionReviews.serverId],
      name: "review_reports_review_server_fk",
    }).onDelete("cascade"),
    uniqueIndex("review_reports_open_reporter_unique")
      .on(table.reviewId, table.reporterId)
      .where(sql`outcome is null`),
    check(
      "review_reports_category",
      sql`${table.category} in ('abuse', 'privacy', 'spoiler', 'image', 'unrelated', 'other')`,
    ),
    check("review_reports_detail_length", sql`char_length(${table.detail}) <= 200`),
  ],
).enableRLS();

export type SessionReview = typeof sessionReviews.$inferSelect;

export type ReviewReport = typeof reviewReports.$inferSelect;
