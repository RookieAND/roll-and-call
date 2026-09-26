"use server";

import { and, desc, eq, isNull, ne, or, sql } from "drizzle-orm";

import { CERT_FORMAT, CERT_SHOTS, RULEBOOK_KIND } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certPhotoPathOf } from "@/shared/lib";
import {
  certApplications,
  certifications,
  db,
  getCurrentUser,
  rulebookQuizQuestions,
  rulebooks,
  sanctions,
} from "@/shared/server";

import type { CertEntry } from "../model/cert-entry";
import { isQuizAnswer } from "../model/is-quiz-answer";
import { QUIZ_ANSWER_FIELD } from "../model/quiz-answer-field";

// 한 번에 한 권. 사용 중인 본문 퀴즈가 있는 책은 낸 문항의 답이 맞아야 받는다. 서플리먼트는 같은 판본 기본 룰북을 모두 가진(인증·신판 인증·무료 배포) 뒤에만 받는다.
// ponytail: 같은 책을 두 번 눌러 동시에 내는 경우는 막지 않는다. 운영진이 한 건을 반려하면 된다.
export async function submitCertification({
  entry,
  quiz,
}: {
  entry: CertEntry;
  quiz: { questionId: string; answer: string } | null;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const ownFile = (url: string) => certPhotoPathOf(url)?.startsWith(`${user.id}/`) ?? false;
  const physical = entry.format === CERT_FORMAT.physical;
  if (physical) {
    if (!CERT_SHOTS.every((shot) => ownFile(entry.photos[shot])))
      return { error: "사진 3장을 모두 올려 주세요." };
  } else {
    if (!ownFile(entry.captureUrl) || !ownFile(entry.receiptUrl))
      return { error: "구매 내역과 영수증을 모두 올려 주세요." };
    if (!entry.seller.trim() || !entry.orderDate.trim())
      return { error: "판매처와 주문일을 적어 주세요." };
  }

  const [books, certified, applications, [sanction], questions] = await Promise.all([
    db
      .select({
        id: rulebooks.id,
        categoryId: rulebooks.categoryId,
        edition: rulebooks.edition,
        kind: rulebooks.kind,
        certRequired: rulebooks.certRequired,
        supersedesId: rulebooks.supersedesId,
      })
      .from(rulebooks)
      .where(eq(rulebooks.hidden, false)),
    db
      .select({ rulebookId: certifications.rulebookId })
      .from(certifications)
      .where(and(eq(certifications.userId, user.id), isNull(certifications.revokedAt))),
    db
      .select({
        rulebookId: certApplications.rulebookId,
        status: certApplications.status,
        photoUrls: certApplications.photoUrls,
      })
      .from(certApplications)
      .where(and(eq(certApplications.userId, user.id), ne(certApplications.status, "withdrawn")))
      .orderBy(desc(certApplications.createdAt)),
    db
      .select({ id: sanctions.id })
      .from(sanctions)
      .where(
        and(
          eq(sanctions.userId, user.id),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), sql`${sanctions.until} > now()`),
        ),
      ),
    db
      .select({ id: rulebookQuizQuestions.id, answers: rulebookQuizQuestions.answers })
      .from(rulebookQuizQuestions)
      .where(
        and(
          eq(rulebookQuizQuestions.rulebookId, entry.rulebookId),
          eq(rulebookQuizQuestions.active, true),
        ),
      ),
  ]);
  if (sanction) return { error: "활동 정지 기간에는 인증을 신청할 수 없습니다." };

  const book = books.find((candidate) => candidate.id === entry.rulebookId);
  if (!book) return { error: "책을 다시 골라 주세요." };
  if (!book.certRequired) return { error: "인증 없이 구인을 열 수 있는 룰입니다." };
  const certifiedIds = new Set(certified.map((row) => row.rulebookId));
  if (certifiedIds.has(book.id)) return { error: "이미 인증된 룰북입니다." };
  const latest = applications.find((application) => application.rulebookId === book.id);
  if (latest?.status === "pending") return { error: "심사 중인 신청이 있습니다." };
  const opened = (core: (typeof books)[number]) =>
    !core.certRequired ||
    certifiedIds.has(core.id) ||
    books.some((newer) => newer.supersedesId === core.id && certifiedIds.has(newer.id));
  const cores = books.filter(
    (candidate) =>
      candidate.kind === RULEBOOK_KIND.core &&
      candidate.categoryId === book.categoryId &&
      candidate.edition === book.edition,
  );
  if (book.kind === RULEBOOK_KIND.supplement && !cores.every(opened)) {
    return { error: "같은 판본의 기본 룰북을 먼저 인증해야 합니다." };
  }

  const question = questions.find((candidate) => candidate.id === quiz?.questionId);
  if (questions.length > 0 && !question) {
    return { error: "퀴즈가 바뀌었습니다. 화면을 새로 고쳐 주세요." };
  }
  if (question && !isQuizAnswer({ answer: quiz!.answer, answers: question.answers })) {
    return { error: "답이 맞지 않습니다. 책을 다시 확인해 주세요.", field: QUIZ_ANSWER_FIELD };
  }

  const previous = latest?.status === "rejected" ? latest.photoUrls : null;
  await db.insert(certApplications).values({
    userId: user.id,
    rulebookId: book.id,
    format: entry.format,
    photoUrls: physical ? entry.photos : {},
    replacedShots:
      previous && physical
        ? CERT_SHOTS.filter((shot) => previous[shot] !== entry.photos[shot])
        : [],
    seller: physical ? null : entry.seller.trim().slice(0, 100),
    purchaseCaptureUrl: physical ? null : entry.captureUrl,
    receiptUrl: physical ? null : entry.receiptUrl,
    orderNumber: physical ? null : entry.orderNumber.trim().slice(0, 100) || null,
    orderDate: physical ? null : entry.orderDate.trim().slice(0, 20),
    quizQuestionId: question?.id ?? null,
    quizAnswer: question ? quiz!.answer.trim().slice(0, 200) : null,
  });
  return { redirect: `/me/rulebooks/${book.id}/submitted` };
}
