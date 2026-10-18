import { groupBy, keyBy } from "es-toolkit";

import type { CertApplication } from "../types";
import type { ShapeContext } from "./shape-context";

const rejectedKey = (row: { userId: string; rulebookId: string }) =>
  `${row.userId}:${row.rulebookId}`;

export function buildCertApplications({
  tables,
  nicknameOf,
  rulebookLabelOf,
}: ShapeContext): CertApplication[] {
  const quizOf = keyBy(tables.quizRows, (question) => question.id);
  const rejectedBy = groupBy(
    tables.applicationRows
      .filter((row) => row.status === "rejected")
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    rejectedKey,
  );
  return tables.applicationRows.map((row) => {
    const quiz = row.quizQuestionId ? quizOf[row.quizQuestionId] : undefined;
    return {
      id: row.id,
      userId: row.userId,
      rulebookId: row.rulebookId,
      rulebook: rulebookLabelOf(row.rulebookId) ?? "",
      groupId: row.groupId,
      format: row.format,
      direct: row.direct,
      rejectReason: row.rejectReason ?? undefined,
      appliedAt: row.createdAt,
      memo: row.memo,
      photoUrls: row.photoUrls,
      replacedShots: row.replacedShots,
      purchase: {
        seller: row.seller,
        captureUrl: row.purchaseCaptureUrl,
        receiptUrl: row.receiptUrl,
        orderNumber: row.orderNumber,
        orderDate: row.orderDate,
      },
      // 같은 사람이 같은 룰북으로 먼저 냈다가 반려된 신청이 재신청 이력이다.
      previousRejections: (rejectedBy[rejectedKey(row)] ?? [])
        .filter((earlier) => earlier.createdAt < row.createdAt)
        .map((earlier) => ({
          rejectedAt: earlier.processedAt ?? earlier.createdAt,
          tags: earlier.rejectTag ? [earlier.rejectTag] : [],
          requests: earlier.rejectReason ? [earlier.rejectReason] : [],
          flaggedShots: earlier.flaggedShots,
          photoUrls: earlier.photoUrls,
        })),
      quiz: quiz
        ? { question: quiz.question, answer: row.quizAnswer ?? "", page: quiz.page }
        : undefined,
      status: row.status,
      flaggedShots: row.flaggedShots,
      processedBy: row.processedBy ? nicknameOf(row.processedBy) : undefined,
      processedAt: row.processedAt ?? undefined,
    };
  });
}
