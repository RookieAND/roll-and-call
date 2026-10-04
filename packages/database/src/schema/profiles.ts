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

import { serverId } from "./server-id";

// 본인이 적는 성향. 서버에서 정규화해 넣으므로 읽는 화면은 다시 다듬지 않는다.
export type ProfileKeyword = string;

// 요일 하나에 구간 목록. day는 0=월 … 6=일, from·to는 1시간 단위 시각(0~24).
export type AvailabilityInterval = { day: number; from: number; to: number };

// service는 link-services의 키, value는 핸들이나 주소 원문.
export type ProfileLink = { service: string; value: string };

// Mirror of auth.users, kept in sync by a trigger. `id` equals the Supabase auth uid.
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    discordId: text("discord_id").notNull().unique(),
    username: text("username").notNull(),
    avatarUrl: text("avatar_url"),
    // bio부터 featuredBadges까지는 server_members로 옮겨 더 읽고 쓰지 않는다. 다음 단계에서 지운다.
    bio: text("bio"),
    keywords: text("keywords").array().notNull().default([]),
    availability: jsonb("availability").$type<AvailabilityInterval[]>().notNull().default([]),
    links: jsonb("links").$type<ProfileLink[]>().notNull().default([]),
    showGmBadge: boolean("show_gm_badge").notNull().default(true),
    showBadges: boolean("show_badges").notNull().default(true),
    featuredBadges: text("featured_badges").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    // 서비스 소개를 처음 본 시각. null이면 서버 홈에 처음 닿을 때 소개로 보낸다(계정당 한 번).
    onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  },
  (table) => [
    check("profiles_featured_badges_limit", sql`cardinality(${table.featuredBadges}) <= 3`),
  ],
);

// 쓴 사람만 본다. 상대는 내용도, 메모가 있다는 사실도 볼 수 없다.
export const profileMemos = pgTable(
  "profile_memos",
  {
    serverId: serverId(),
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
    primaryKey({ columns: [table.serverId, table.ownerId, table.targetId] }),
    // 프로필 삭제 시 cascade가 owner_id·target_id로 찾는다.
    index("profile_memos_owner_id_idx").on(table.ownerId),
    index("profile_memos_target_id_idx").on(table.targetId),
  ],
);

export type Profile = typeof profiles.$inferSelect;

export type NewProfile = typeof profiles.$inferInsert;

export type ProfileMemo = typeof profileMemos.$inferSelect;
