import { sql } from "drizzle-orm";
import {
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

import { HOMEBREW_APPLICATION_STATUSES } from "../modules/homebrew/model/homebrew-application-status";
import { HOMEBREW_LIMIT } from "../modules/homebrew/model/homebrew-limit";
import { HOMEBREW_RULE_SCOPES } from "../modules/homebrew/model/homebrew-rule-scope";
import { profiles } from "./profiles";
import { rulebooks } from "./rulebooks";
import { serverId } from "./server-id";

export const homebrewRuleScope = pgEnum("homebrew_rule_scope", HOMEBREW_RULE_SCOPES);

export const homebrewApplicationStatus = pgEnum(
  "homebrew_application_status",
  HOMEBREW_APPLICATION_STATUSES,
);

// 승인된 자작 룰. 행이 있으면 그 룰북은 자작 룰이다(카테고리 하나에 책 하나).
// 제작자가 지워져도 행은 남아 자작 룰임을 잃지 않는다. 현재 심사 자료는 승인된 신청 행(rulebookId)에 있다.
export const homebrewRules = pgTable(
  "homebrew_rules",
  {
    rulebookId: uuid("rulebook_id")
      .primaryKey()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    serverId: serverId(),
    makerId: uuid("maker_id").references(() => profiles.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    scope: homebrewRuleScope("scope").notNull().default("maker_only"),
    summary: text("summary").notNull(),
    // 승인 시각
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("homebrew_rules_maker_id_idx").on(table.makerId),
    check(
      "homebrew_rules_summary_length",
      sql`char_length(${table.summary}) <= ${sql.raw(String(HOMEBREW_LIMIT.summaryLength))}`,
    ),
  ],
).enableRLS();

// 자작 룰 등록 신청. 재신청은 반려된 신청(previousId)의 값을 이어받은 새 행이다.
// 반려·거둔 신청의 이미지는 처리 30일 뒤 비운다(purge-homebrew-files). 승인된 행은 그 룰의 현재 자료라 비우지 않는다.
export const homebrewRuleApplications = pgTable(
  "homebrew_rule_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    edition: text("edition").notNull().default(""),
    summary: text("summary").notNull(),
    links: text("links").array().notNull().default([]),
    // 인증 사진과 같은 cert-photos 버킷의 공개 URL 모양 키(certPhotoPathOf).
    imageUrls: text("image_urls").array().notNull().default([]),
    status: homebrewApplicationStatus("status").notNull().default("pending"),
    previousId: uuid("previous_id").references((): AnyPgColumn => homebrewRuleApplications.id, {
      onDelete: "set null",
    }),
    processedBy: uuid("processed_by").references(() => profiles.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    // 승인·반려·거둔 시각
    processedAt: timestamp("processed_at", { withTimezone: true }),
    rejectTag: text("reject_tag"),
    rejectReason: text("reject_reason"),
    rulebookId: uuid("rulebook_id").references(() => rulebooks.id, { onDelete: "set null" }),
    staffMessageId: text("staff_message_id"),
    filesPurgedAt: timestamp("files_purged_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("homebrew_rule_applications_user_id_idx").on(table.userId),
    index("homebrew_rule_applications_server_id_pending_idx")
      .on(table.serverId, table.createdAt)
      .where(sql`status = 'pending'`),
    uniqueIndex("homebrew_rule_applications_rulebook_id_unique")
      .on(table.rulebookId)
      .where(sql`rulebook_id IS NOT NULL`),
    check(
      "homebrew_rule_applications_name_length",
      sql`char_length(${table.name}) between 1 and ${sql.raw(String(HOMEBREW_LIMIT.nameLength))}`,
    ),
    check(
      "homebrew_rule_applications_summary_length",
      sql`char_length(${table.summary}) between 1 and ${sql.raw(String(HOMEBREW_LIMIT.summaryLength))}`,
    ),
    check(
      "homebrew_rule_applications_reject_reason_length",
      sql`char_length(${table.rejectReason}) <= ${sql.raw(String(HOMEBREW_LIMIT.rejectReasonLength))}`,
    ),
    check(
      "homebrew_rule_applications_links_count",
      sql`cardinality(${table.links}) <= ${sql.raw(String(HOMEBREW_LIMIT.links))}`,
    ),
    check(
      "homebrew_rule_applications_images_count",
      sql`cardinality(${table.imageUrls}) <= ${sql.raw(String(HOMEBREW_LIMIT.images))}`,
    ),
    // 자료는 하나 이상. 보관 기간이 지나 이미지를 비운 행은 예외다.
    check(
      "homebrew_rule_applications_has_material",
      sql`${table.filesPurgedAt} IS NOT NULL OR cardinality(${table.links}) + cardinality(${table.imageUrls}) >= 1`,
    ),
  ],
).enableRLS();

export type HomebrewRule = typeof homebrewRules.$inferSelect;

export type HomebrewRuleApplication = typeof homebrewRuleApplications.$inferSelect;
