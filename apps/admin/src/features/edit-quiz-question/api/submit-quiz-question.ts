"use server";

import { revalidatePath } from "next/cache";

import { requireStaff, saveQuizQuestion, type QuizQuestionInput } from "@/shared/server";

export async function submitQuizQuestion(
  rulebookId: string,
  id: string | null,
  input: QuizQuestionInput,
) {
  const staff = await requireStaff();
  const question = input.question.trim();
  const answers = [...new Set(input.answers.map((answer) => answer.trim()).filter(Boolean))];
  if (!question || answers.length === 0) throw new Error("질문과 허용하는 답을 입력해 주세요");
  await saveQuizQuestion(
    rulebookId,
    id,
    { question, answers, page: input.page.trim(), active: input.active },
    staff,
  );
  revalidatePath("/", "layout");
}
