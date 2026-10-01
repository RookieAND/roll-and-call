import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { type AvailabilityInterval, type ProfileLink, profiles } from "./profiles";

// 디스코드 서버 하나가 한 행이다. 서버 안의 데이터는 모두 server_id로 이 행에 묶인다.
export const servers = pgTable("servers", {
  id: uuid("id").primaryKey().defaultRandom(),
  discordGuildId: text("discord_guild_id").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  recruitChannelId: text("recruit_channel_id"),
  closedChannelId: text("closed_channel_id"),
  reviewForumChannelId: text("review_forum_channel_id"),
  gmRoleId: text("gm_role_id"),
  certEnforcementDate: timestamp("cert_enforcement_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

// 계정(profiles)은 전역이고, 서버 안에서 보이는 프로필은 여기 있다. 나가도 지우지 않고 deleted_at만 채워 재가입 때 되살린다.
export const serverMembers = pgTable(
  "server_members",
  {
    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    bio: text("bio"),
    keywords: text("keywords").array().notNull().default([]),
    availability: jsonb("availability").$type<AvailabilityInterval[]>().notNull().default([]),
    links: jsonb("links").$type<ProfileLink[]>().notNull().default([]),
    // 인증된 룰북이 있어도 Player로 보이고 싶으면 끈다.
    showGmBadge: boolean("show_gm_badge").notNull().default(true),
    showBadges: boolean("show_badges").notNull().default(true),
    // 이름 아래 고정할 뱃지 키. 누른 순서대로 최대 3개이고, 비어 있으면 최근에 받은 3개를 보인다.
    featuredBadges: text("featured_badges").array().notNull().default([]),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.userId] }),
    index("server_members_user_id_idx").on(table.userId),
    check("server_members_featured_badges_limit", sql`cardinality(${table.featuredBadges}) <= 3`),
  ],
).enableRLS();

export type Server = typeof servers.$inferSelect;

export type ServerMember = typeof serverMembers.$inferSelect;
