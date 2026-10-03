import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { rulebookQuizQuestions, rulebooks } from "#/schema";

export interface QuizQuestionInput {
  question: string;
  answers: string[];
  page: string;
  active: boolean;
}

// 출제된 문항은 지우지 않고 active만 끈다.
export async function saveQuizQuestion({
  serverId,
  rulebookId,
  id,
  input,
  actor,
}: {
  serverId: string;
  rulebookId: string;
  id: string | null;
  input: QuizQuestionInput;
  actor: Actor;
}) {
  await db.transaction(async (tx) => {
    const [rulebook] = await tx
      .select()
      .from(rulebooks)
      .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, rulebookId)));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const [before] = id
      ? await tx
          .select()
          .from(rulebookQuizQuestions)
          .where(
            and(eq(rulebookQuizQuestions.serverId, serverId), eq(rulebookQuizQuestions.id, id)),
          )
      : [];
    if (id && !before) throw new Error("문항을 찾을 수 없습니다");
    if (id) {
      await tx
        .update(rulebookQuizQuestions)
        .set(input)
        .where(and(eq(rulebookQuizQuestions.serverId, serverId), eq(rulebookQuizQuestions.id, id)));
    } else {
      await tx.insert(rulebookQuizQuestions).values({ serverId, rulebookId, ...input });
    }
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: id ? "퀴즈 문항 수정" : "퀴즈 문항 추가",
        target: rulebookLabel(rulebook),
        reason: input.question,
        before: before
          ? { label: before.active ? "사용 중" : "비활성", sub: before.question }
          : undefined,
        after: { label: input.active ? "사용 중" : "비활성", sub: input.question },
      },
    });
  });
}
