import { and, count, eq, inArray, asc } from "drizzle-orm";

import { db } from "#db/client";
import { certApplications, rulebookQuizQuestions } from "#db/schema";

import { pickQuizQuestion } from "../model/pick-quiz-question";

// findAssignedQuizQuestion을 여러 권에 대해 한 번에 한다. 책마다 배정되는 문항은 같은 규칙(사람·책·반려 횟수)으로 정한다.
// 퀴즈 문항이 없는 책은 결과에 없다. 정답(answers)을 포함하므로 서버 안에서만 쓴다.
export async function findAssignedQuizQuestions({
  serverId,
  userId,
  rulebookIds,
}: {
  serverId: string;
  userId: string;
  rulebookIds: string[];
}) {
  if (rulebookIds.length === 0) return new Map<string, AssignedQuizQuestion>();
  const [questions, rejections] = await Promise.all([
    db
      .select({
        id: rulebookQuizQuestions.id,
        rulebookId: rulebookQuizQuestions.rulebookId,
        question: rulebookQuizQuestions.question,
        answers: rulebookQuizQuestions.answers,
      })
      .from(rulebookQuizQuestions)
      .where(
        and(
          eq(rulebookQuizQuestions.serverId, serverId),
          inArray(rulebookQuizQuestions.rulebookId, rulebookIds),
          eq(rulebookQuizQuestions.active, true),
        ),
      )
      .orderBy(asc(rulebookQuizQuestions.id)),
    db
      .select({ rulebookId: certApplications.rulebookId, value: count() })
      .from(certApplications)
      .where(
        and(
          eq(certApplications.serverId, serverId),
          eq(certApplications.userId, userId),
          inArray(certApplications.rulebookId, rulebookIds),
          eq(certApplications.status, "rejected"),
        ),
      )
      .groupBy(certApplications.rulebookId),
  ]);
  const rejectedCount = new Map(rejections.map((row) => [row.rulebookId, row.value]));
  const assigned = new Map<string, AssignedQuizQuestion>();
  for (const rulebookId of rulebookIds) {
    const picked = pickQuizQuestion({
      questions: questions.filter((question) => question.rulebookId === rulebookId),
      userId,
      rulebookId,
      rejectedCount: rejectedCount.get(rulebookId) ?? 0,
    });
    if (picked) assigned.set(rulebookId, picked);
  }
  return assigned;
}

export interface AssignedQuizQuestion {
  id: string;
  rulebookId: string;
  question: string;
  answers: string[];
}
