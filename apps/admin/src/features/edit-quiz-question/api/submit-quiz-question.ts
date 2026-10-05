"use server";

import { compact, uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";

import {
  getCurrentServer,
  requireStaff,
  saveQuizQuestion,
  type QuizQuestionInput,
} from "@/shared/server";

export async function submitQuizQuestion(
  rulebookId: string,
  id: string | null,
  input: QuizQuestionInput,
) {
  const staff = await requireStaff();
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
