import { and, eq, sql } from "drizzle-orm";

import { db } from "../../../client";
import { rulebookQuizQuestions } from "../../../schema";

// 답은 내려보내지 않는다.
export async function getQuizQuestion({
  serverId,
  rulebookId,
}: {
  serverId: string;
  rulebookId: string;
}) {
  const [question] = await db
    .select({ id: rulebookQuizQuestions.id, question: rulebookQuizQuestions.question })
    .from(rulebookQuizQuestions)
    .where(
      and(
        eq(rulebookQuizQuestions.serverId, serverId),
        eq(rulebookQuizQuestions.rulebookId, rulebookId),
        eq(rulebookQuizQuestions.active, true),
      ),
    )
    .orderBy(sql`random()`)
    .limit(1);
  return question ?? null;
}
