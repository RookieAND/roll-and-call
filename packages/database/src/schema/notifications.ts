import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 받은 알림. 구인·룰북에는 FK를 걸지 않는다(대상이 지워져도 7일 남는다). 받는 사람이 서버를 나가도 지우지 않는다.
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    // 받는 사람
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    // 알림 종류(NOTIFICATION_KIND 값). 종류가 늘어도 마이그레이션이 필요 없게 text로 둔다
    kind: text("kind").notNull(),
    // 화면 문구에 넣을 값(만들 때 값)과 이동할 id
    params: jsonb("params").$type<Record<string, unknown>>().notNull().default({}),
    // 만든 시각
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    // null이면 안 읽음
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (table) => [
    index("notifications_server_user_created_idx").on(
      table.serverId,
      table.userId,
      table.createdAt.desc(),
      table.id.desc(),
    ),
    index("notifications_unread_idx")
      .on(table.serverId, table.userId)
      .where(sql`read_at is null`),
    index("notifications_created_at_idx").on(table.createdAt),
  ],
).enableRLS();

export type NotificationRecord = typeof notifications.$inferSelect;
