"use client";

import { isNull } from "es-toolkit";
import { usePathname, useSearchParams } from "next/navigation";

import { QuizQuestionDialog } from "@/features/edit-quiz-question";
import type { QuizQuestion } from "@/shared/server";

interface QuizDialogSlotProps {
  rulebookId: string;
  questions: QuizQuestion[];
}

export function QuizDialogSlot({ rulebookId, questions }: QuizDialogSlotProps) {
  const pathname = usePathname();
  const questionParam = useSearchParams().get("question");
  const question = questions.find((candidate) => candidate.id === questionParam) ?? null;
  const open = questionParam === "new" || !isNull(question);
  return (
    <QuizQuestionDialog
      key={questionParam ?? "closed"}
      rulebookId={rulebookId}
      question={question}
      open={open}
      onClose={() => window.history.replaceState(null, "", `${pathname}?tab=quiz`)}
    />
  );
}
