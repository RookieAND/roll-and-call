import "server-only";
import { db, rulebookQuizQuestions } from "@roll-and-call/database";
import { and, eq, sql } from "drizzle-orm";

// 답은 내려보내지 않는다.
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
