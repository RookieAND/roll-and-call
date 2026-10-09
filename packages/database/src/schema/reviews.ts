import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
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
    // 마스터링 후기(gm)는 GM이 쓰고, 나머지는 참석자 후기다.
    authorRole: text("author_role").notNull().default("participant"),
    body: text("body").notNull(),
    spoiler: boolean("spoiler").notNull().default(false),
    // review-photos 버킷의 공개 URL. 배열 순서가 보이는 순서다.
    photoUrls: text("photo_urls").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    hiddenBy: uuid("hidden_by").references(() => profiles.id, { onDelete: "set null" }),
    // 사유 코드(CONTENT_REASON 키)와 기타일 때 입력한 글. 보이는 글은 reasonLabel로 만든다.
    hiddenReasonCode: text("hidden_reason_code"),
    hiddenReasonText: text("hidden_reason_text"),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    removedBy: uuid("removed_by").references(() => profiles.id, { onDelete: "set null" }),
    removedReasonCode: text("removed_reason_code"),
    removedReasonText: text("removed_reason_text"),
    // 세션후기 포럼 게시글(스레드) 또는 텍스트 채널 메시지 id. 공개가 아니게 되면 지우고 비운다.
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
    check("session_reviews_author_role", sql`${table.authorRole} in ('participant', 'gm')`),
    check("session_reviews_photo_limit", sql`cardinality(${table.photoUrls}) <= 5`),
  ],
).enableRLS();

export type SessionReview = typeof sessionReviews.$inferSelect;
