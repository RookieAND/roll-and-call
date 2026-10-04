import { and, asc, count, eq } from "drizzle-orm";

import { db } from "#/client";
import { certApplications, rulebookQuizQuestions } from "#/schema";

import { pickQuizQuestion } from "../model/pick-quiz-question";

// 출제 화면과 제출 검사가 같은 문항을 고르도록 둘 다 이 함수를 쓴다. 반려 수는 지운 기록까지 모두 센다.
export async function findAssignedQuizQuestion({
  serverId,
  rulebookId,
  userId,
}: {
  serverId: string;
  rulebookId: string;
  userId: string;
}) {
  const [questions, [rejected]] = await Promise.all([
    db
      .select({
        id: rulebookQuizQuestions.id,
        question: rulebookQuizQuestions.question,
        answers: rulebookQuizQuestions.answers,
      })
      .from(rulebookQuizQuestions)
      .where(
        and(
          eq(rulebookQuizQuestions.serverId, serverId),
          eq(rulebookQuizQuestions.rulebookId, rulebookId),
          eq(rulebookQuizQuestions.active, true),
        ),
      )
      .orderBy(asc(rulebookQuizQuestions.id)),
    db
      .select({ value: count() })
      .from(certApplications)
      .where(
        and(
          eq(certApplications.serverId, serverId),
          eq(certApplications.userId, userId),
          eq(certApplications.rulebookId, rulebookId),
          eq(certApplications.status, "rejected"),
        ),
      ),
  ]);
  return pickQuizQuestion({
    questions,
    userId,
    rulebookId,
    rejectedCount: rejected?.value ?? 0,
  });
}
