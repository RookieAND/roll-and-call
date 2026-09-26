import "server-only";
import { db, rulebookQuizQuestions } from "@roll-and-call/database";
import { and, eq, sql } from "drizzle-orm";

// 책의 사용 중인 본문 퀴즈 가운데 한 문항을 무작위로. 답은 내려보내지 않는다. 없으면 null.
export async function getQuizQuestion(rulebookId: string) {
  const [question] = await db
    .select({ id: rulebookQuizQuestions.id, question: rulebookQuizQuestions.question })
    .from(rulebookQuizQuestions)
    .where(
      and(eq(rulebookQuizQuestions.rulebookId, rulebookId), eq(rulebookQuizQuestions.active, true)),
    )
    .orderBy(sql`random()`)
    .limit(1);
  return question ?? null;
}
