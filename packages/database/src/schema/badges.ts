import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { games } from "./games";
import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 기록에서 매번 다시 계산해 이 표와 비교한다(evaluateBadges). 단계형은 키 하나에 지금 단계만 두고,
// 이달의 GM·PL은 달마다 한 줄(gm.monthly.2026-09)이라 지난 기록이 남는다. 근거가 사라지면 지우지 않고 revokedAt을 채운다.
export const userBadges = pgTable(
  "user_badges",
  {
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    badgeKey: text("badge_key").notNull(),
    tier: integer("tier").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull(),
    sourceGameId: uuid("source_game_id").references(() => games.id, { onDelete: "set null" }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    // 획득 시트를 닫은 시각. null이면 다음 방문 때 시트를 띄운다.
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    // 도감을 연 시각. null이면 새 뱃지 점을 찍는다.
    seenAt: timestamp("seen_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.userId, table.badgeKey] }),
    index("user_badges_user_id_idx").on(table.userId),
    check("user_badges_tier_positive", sql`${table.tier} >= 1`),
  ],
).enableRLS();

export type UserBadge = typeof userBadges.$inferSelect;

// 아래 테이블은 모두 RLS만 켜고 정책을 두지 않는다. 어드민 서버(DATABASE_URL)만 읽고 쓴다.
