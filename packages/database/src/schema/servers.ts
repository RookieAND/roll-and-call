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
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { type AvailabilityInterval, type ProfileLink, profiles } from "./profiles";

// 모집 포럼 글에 붙일 태그. 값은 포럼 태그 id이고, 비면 태그 이름으로 찾는다.
export interface ForumTagMap {
  open?: string;
  closed?: string;
  cancelled?: string;
  // 룰북 분류(rulebook_categories.id)마다 태그 하나.
  categories?: Record<string, string>;
}

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
  announceChannelId: text("announce_channel_id"),
  // 운영진만 보는 디스코드 채널. 처리 대기와 무거운 조치 글을 올린다. 비면 올리지 않는다.
  staffChannelId: text("staff_channel_id"),
  forumTags: jsonb("forum_tags").$type<ForumTagMap>(),
  // 디스코드 서버장. 어드민에 들어올 때 길드 정보와 비교해 바뀌었으면 소유권을 옮긴다.
  ownerDiscordId: text("owner_discord_id"),
  // 디스코드 서버 멤버가 아니라 가입할 수 없을 때 보여 주는 초대 링크. 없으면 안내 문구만 보인다.
  inviteUrl: text("invite_url"),
  // 월간 발표를 보낸 마지막 달, YYYY-MM. 다시 보내지 않게 막는다.
  monthlyAnnouncedMonth: text("monthly_announced_month"),
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
    // 이 서버에서 보이는 닉네임. 활동 중인 멤버끼리 대소문자 없이 유일하다.
    nickname: text("nickname").notNull(),
    // 겹쳐서 숫자를 붙였을 때 붙이기 전 닉네임. 값이 있으면 숫자가 붙은 상태이고, 본인이나 운영진이 닉네임을 저장하면 비운다.
    nicknameSuffixBase: text("nickname_suffix_base"),
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
    // 나갔다가 다시 들어온 때. 어드민 유저 상세에 재가입 표시를 붙인다.
    rejoinedAt: timestamp("rejoined_at", { withTimezone: true }),
    // 추방하면 디스코드에서 차단하고 이 칸을 채운다. 차단 해제 때 비운다.
    bannedAt: timestamp("banned_at", { withTimezone: true }),
    bannedBy: uuid("banned_by").references(() => profiles.id, { onDelete: "set null" }),
    // 사유 코드(USER_ACTION_REASON 키)와 기타일 때 입력한 글. 보이는 글은 reasonLabel로 만든다.
    banReasonCode: text("ban_reason_code"),
    banReasonText: text("ban_reason_text"),
    // 인덱스의 내 서버 목록을 최근 방문 순으로 늘어놓는다. 서버 화면에 들어올 때 채운다.
    lastVisitedAt: timestamp("last_visited_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.userId] }),
    index("server_members_user_id_idx").on(table.userId),
    uniqueIndex("server_members_active_nickname_uq")
      .on(table.serverId, sql`lower(${table.nickname})`)
      .where(sql`${table.deletedAt} is null`),
    check("server_members_featured_badges_limit", sql`cardinality(${table.featuredBadges}) <= 3`),
  ],
).enableRLS();

// 봇 메시지 위에 붙일 머리 줄. 행이 없으면 기본 문구(구인 개설만 있고 나머지는 머리 줄 없음)를 쓴다. 빈 문자열은 머리 줄 없이 보낸다는 뜻이다.
export const serverMessageHeads = pgTable(
  "server_message_heads",
  {
    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id),
    caseKey: text("case_key").notNull(),
    headLine: text("head_line").notNull(),
    updatedBy: uuid("updated_by").references(() => profiles.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.serverId, table.caseKey] })],
).enableRLS();

// 봇 메시지 임베드의 설명 문장. 행이 없으면 코드의 기본 문장을 쓴다. 기본과 같게 저장하면 행을 지운다.
export const serverMessageTexts = pgTable(
  "server_message_texts",
  {
    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id),
    textKey: text("text_key").notNull(),
    body: text("body").notNull(),
    updatedBy: uuid("updated_by").references(() => profiles.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.serverId, table.textKey] })],
).enableRLS();

export type Server = typeof servers.$inferSelect;

export type ServerMember = typeof serverMembers.$inferSelect;
