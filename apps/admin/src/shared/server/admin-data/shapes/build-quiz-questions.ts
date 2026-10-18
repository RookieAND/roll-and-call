import { countBy } from "es-toolkit";

import type { QuizQuestion } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildQuizQuestions({ tables }: ShapeContext): QuizQuestion[] {
  const askedCounts = countBy(
    tables.applicationRows,
    (application) => application.quizQuestionId ?? "",
  );
  return tables.quizRows
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((row) => ({
      id: row.id,
      rulebookId: row.rulebookId,
      question: row.question,
      answers: row.answers,
      page: row.page,
      active: row.active,
      askedCount: askedCounts[row.id] ?? 0,
    }));
}
