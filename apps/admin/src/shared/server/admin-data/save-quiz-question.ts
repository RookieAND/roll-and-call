import "server-only";
import { db, rulebookQuizQuestions, rulebooks } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

export interface QuizQuestionInput {
  question: string;
  answers: string[];
  page: string;
  active: boolean;
}

// id가 없으면 새 문항을 넣고, 있으면 고친다. 출제된 문항은 지우지 않고 active만 끈다.
export async function saveQuizQuestion(
  rulebookId: string,
  id: string | null,
  input: QuizQuestionInput,
  actor: Actor,
) {
  await db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, rulebookId));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const [before] = id
      ? await tx.select().from(rulebookQuizQuestions).where(eq(rulebookQuizQuestions.id, id))
      : [];
    if (id && !before) throw new Error("문항을 찾을 수 없습니다");
    if (id) {
      await tx.update(rulebookQuizQuestions).set(input).where(eq(rulebookQuizQuestions.id, id));
    } else {
      await tx.insert(rulebookQuizQuestions).values({ rulebookId, ...input });
    }
    await recordAudit(tx, actor, {
      action: id ? "퀴즈 문항 수정" : "퀴즈 문항 추가",
      target: rulebookLabel(rulebook),
      reason: input.question,
      before: before
        ? { label: before.active ? "사용 중" : "비활성", sub: before.question }
        : undefined,
      after: { label: input.active ? "사용 중" : "비활성", sub: input.question },
    });
  });
}
