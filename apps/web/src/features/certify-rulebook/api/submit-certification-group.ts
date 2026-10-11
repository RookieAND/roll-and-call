"use server";

import {
  createCertApplicationGroup,
  loadBulkQuizQuestions,
  loadCertificationContext,
} from "@roll-and-call/database/certifications";
import {
  BULK_CERT_MAX_BOOKS,
  BULK_CERT_MAX_PHOTOS,
} from "@roll-and-call/database/certifications/model";
import { getMemberIdentity } from "@roll-and-call/database/profiles";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import { CERT_FORMAT, CERT_FORMAT_LABEL, rulebookLabel } from "@/entities/rulebook";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notMemberError,
  postStaffNotice,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

import { bulkBlockedReason } from "../model/bulk-blocked-reason";
import { bulkNoticeLabel } from "../model/bulk-notice-label";
import { bulkPhotoUrls } from "../model/bulk-photo-urls";
import { bulkQuizAnswerField } from "../model/bulk-quiz-field";
import { isOwnCertFile } from "../model/is-own-cert-file";
import { isQuizAnswer } from "../model/is-quiz-answer";
import { QUIZ_WRONG_ANSWER } from "../model/quiz-wrong-answer";

const TEXT_INPUT_MAX = 1000;
const QUIZ_ANSWER_MAX = 200;

const inputSchema = z.object({
  rulebookIds: z
    .array(idSchema)
    .min(2)
    .max(BULK_CERT_MAX_BOOKS)
    .refine((ids) => new Set(ids).size === ids.length),
  photos: z.array(z.string().max(TEXT_INPUT_MAX)).min(1).max(BULK_CERT_MAX_PHOTOS),
  quizAnswers: z.record(idSchema, z.string().max(TEXT_INPUT_MAX)),
});

// 사진 한 묶음으로 여러 권을 신청한다. 심사와 결과는 권마다 따로 나간다.
// 퀴즈는 loadBulkQuizQuestions가 고른 책(최대 3권)만 내므로, 그 책들의 답만 검사한다.
export async function submitCertificationGroup(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { rulebookIds, photos, quizAnswers } = parsed.data;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  if (!photos.every((url) => isOwnCertFile({ url, serverId: server.id, userId: user.id }))) {
    return { error: "사진을 다시 올려 주세요." };
  }

  const { books, certified, applications, sanction } = await loadCertificationContext({
    serverId: server.id,
    userId: user.id,
  });
  if (sanction) return { error: "활동 정지 기간에는 인증을 신청할 수 없습니다." };

  const latestStatus = new Map<string, string>();
  for (const application of applications) {
    if (!latestStatus.has(application.rulebookId)) {
      latestStatus.set(application.rulebookId, application.status);
    }
  }
  const blocked = bulkBlockedReason({
    rulebookIds,
    books,
    certifiedIds: new Set(certified.map((row) => row.rulebookId)),
    pendingIds: new Set(
      [...latestStatus].filter(([, status]) => status === "pending").map(([id]) => id),
    ),
  });
  if (blocked) return { error: blocked };

  const quizQuestions = await loadBulkQuizQuestions({
    serverId: server.id,
    userId: user.id,
    rulebookIds,
  });
  const labelOf = (rulebookId: string) =>
    rulebookLabel(books.find((book) => book.id === rulebookId)!);
  for (const question of quizQuestions) {
    const answer = quizAnswers[question.rulebookId] ?? "";
    if (!isQuizAnswer({ answer, answers: question.answers })) {
      return {
        error: QUIZ_WRONG_ANSWER,
        field: bulkQuizAnswerField(question.rulebookId),
      };
    }
  }
  const questionByBook = new Map(quizQuestions.map((question) => [question.rulebookId, question]));

  const photoUrls = bulkPhotoUrls(photos);
  const { applications: created } = await createCertApplicationGroup({
    serverId: server.id,
    applications: rulebookIds.map((rulebookId) => {
      const question = questionByBook.get(rulebookId);
      return {
        userId: user.id,
        rulebookId,
        format: CERT_FORMAT.physical,
        photoUrls,
        quizQuestionId: question?.id ?? null,
        quizAnswer: question
          ? (quizAnswers[rulebookId] ?? "").trim().slice(0, QUIZ_ANSWER_MAX)
          : null,
      };
    }),
  });
  after(async () => {
    const applicant = await getMemberIdentity({ serverId: server.id, userId: user.id });
    if (!applicant) return;
    await postStaffNotice({
      server,
      notice: {
        kind: STAFF_NOTICE_KIND.certApplied,
        applicantNickname: applicant.nickname,
        applicantDiscordId: applicant.discordId,
        applicantAvatarUrl: applicant.avatarUrl,
        rulebookLabel: bulkNoticeLabel({ labels: rulebookIds.map(labelOf) }),
        applicationId: created[0]!.id,
        formatLabel: CERT_FORMAT_LABEL[CERT_FORMAT.physical],
      },
    });
  });
  redirect(serverPath({ slug: server.slug, path: `/me/rulebooks/${rulebookIds[0]}/submitted` }));
}
