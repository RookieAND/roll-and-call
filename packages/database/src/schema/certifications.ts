import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { rulebookQuizQuestions, rulebooks } from "./rulebooks";
import { serverId } from "./server-id";

// withdrawn은 신청자가 심사 전에 거둔 신청이다. 사진은 지우고 행만 남겨 어드민이 거둔 사실을 알린다.
export const certApplicationStatus = pgEnum("cert_application_status", [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
]);

// 인증 사진은 앞면(닉네임 쪽지와 함께)·뒷면·옆면(책등) 세 장이다.
export type CertShot = "front" | "back" | "side";

// 실물은 사진 3장, 전자책은 구매 내역·영수증 캡처로 확인한다.
export const certFormat = pgEnum("cert_format", ["physical", "ebook"]);

// 한 사람이 같은 룰북을 여러 번 신청할 수 있다. 반려된 이전 신청이 재신청 이력이다.
export const certApplications = pgTable(
  "cert_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rulebookId: uuid("rulebook_id")
      .notNull()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    memo: text("memo").notNull().default(""),
    photoUrls: jsonb("photo_urls").$type<Partial<Record<CertShot, string>>>().notNull().default({}),
    // 재신청에서 이전 신청과 달라진 사진.
    replacedShots: text("replaced_shots").array().$type<CertShot[]>().notNull().default([]),
    // 여러 권을 한 번에 신청하면 권마다 한 건씩 만들고 같은 사진·구매 기록을 나눠 쓴다.
    groupId: uuid("group_id"),
    format: certFormat("format").notNull().default("physical"),
    // 운영진이 직접 준 인증을 반려로 돌리며 만든 기록. 사진·구매 기록 없이 사유만 있다.
    direct: boolean("direct").notNull().default(false),
    // 전자책은 구매 내역(purchaseCaptureUrl)·영수증(receiptUrl)·판매처·주문번호가 필수, 실물은 모두 선택이다.
    seller: text("seller"),
    purchaseCaptureUrl: text("purchase_capture_url"),
    receiptUrl: text("receipt_url"),
    orderNumber: text("order_number"),
    orderDate: text("order_date"),
    // 신청할 때 낸 본문 퀴즈 문항과 신청자의 답. 퀴즈 없이 낸 신청은 비어 있다.
    quizQuestionId: uuid("quiz_question_id").references(() => rulebookQuizQuestions.id, {
      onDelete: "set null",
    }),
    quizAnswer: text("quiz_answer"),
    status: certApplicationStatus("status").notNull().default("pending"),
    rejectTag: text("reject_tag"),
    rejectReason: text("reject_reason"),
    flaggedShots: text("flagged_shots").array().$type<CertShot[]>().notNull().default([]),
    processedBy: uuid("processed_by").references(() => profiles.id, { onDelete: "set null" }),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    // 보관 기간(결정 뒤 30일)이 지나 사진 칸을 비운 시각
    filesPurgedAt: timestamp("files_purged_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("cert_applications_user_id_idx").on(table.userId),
    index("cert_applications_rulebook_id_idx").on(table.rulebookId),
    // 심사 대기열은 대기 중인 신청만 본다.
    index("cert_applications_server_id_pending_idx")
      .on(table.serverId, table.createdAt)
      .where(sql`status = 'pending'`),
  ],
).enableRLS();

export const certifications = pgTable(
  "certifications",
  {
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rulebookId: uuid("rulebook_id")
      .notNull()
      .references(() => rulebooks.id, { onDelete: "cascade" }),
    approvedBy: uuid("approved_by").references(() => profiles.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }).notNull().defaultNow(),
    // 운영진이 취소하면 지우지 않고 남긴다. 사용자 화면의 "인증 취소됨"과 사유가 여기서 나온다.
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => profiles.id, { onDelete: "set null" }),
    revokeReason: text("revoke_reason"),
  },
  (table) => [
    primaryKey({ columns: [table.serverId, table.userId, table.rulebookId] }),
    index("certifications_user_id_idx").on(table.userId),
    index("certifications_rulebook_id_idx").on(table.rulebookId),
  ],
).enableRLS();

export type CertApplication = typeof certApplications.$inferSelect;
