"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { QuizQuestionDialog } from "@/features/edit-quiz-question";
import type { QuizQuestion } from "@/shared/server";

interface QuizDialogSlotProps {
  rulebookId: string;
  questions: QuizQuestion[];
}

export function QuizDialogSlot({ rulebookId, questions }: QuizDialogSlotProps) {
  const router = useRouter();
  const pathname = usePathname();
  const questionParam = useSearchParams().get("question");
  const question = questions.find((candidate) => candidate.id === questionParam) ?? null;
  const open = questionParam === "new" || question !== null;
  return (
    <QuizQuestionDialog
      key={questionParam ?? "closed"}
      rulebookId={rulebookId}
      question={question}
      open={open}
      onClose={() => router.replace(`${pathname}?tab=quiz`, { scroll: false })}
    />
  );
}
