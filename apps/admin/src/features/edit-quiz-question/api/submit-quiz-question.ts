"use server";

import { compact, uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import {
  getCurrentServer,
  requireStaff,
  saveQuizQuestion,
  type QuizQuestionInput,
} from "@/shared/server";

const submitQuizQuestionSchema = z.object({
  rulebookId: idSchema,
  id: idSchema.nullable(),
  input: z.object({
    question: z.string().max(2000),
    answers: z.array(z.string().max(500)).max(100),
    page: z.string().max(200),
    active: z.boolean(),
  }) satisfies z.ZodType<QuizQuestionInput>,
});

export async function submitQuizQuestion(
  rawRulebookId: string,
  rawId: string | null,
  rawInput: QuizQuestionInput,
) {
  const staff = await requireStaff();
  const { rulebookId, id, input } = parseActionInput(submitQuizQuestionSchema, {
    rulebookId: rawRulebookId,
    id: rawId,
    input: rawInput,
  });
  const question = input.question.trim();
  const answers = uniq(compact(input.answers.map((answer) => answer.trim())));
  if (!question || answers.length === 0) {
    return { ok: false as const, error: "질문과 허용하는 답을 입력해 주세요" };
  }
  const server = await getCurrentServer();
  await saveQuizQuestion({
    serverId: server.id,
    rulebookId,
    id,
    input: { question, answers, page: input.page.trim(), active: input.active },
    actor: staff,
  });
  revalidatePath("/", "layout");
  return { ok: true as const };
}
