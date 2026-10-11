import { Text, VStack } from "@roll-and-call/ui";

import { bulkQuizAnswerField } from "../model/bulk-quiz-field";
import { QuizQuestionField } from "./quiz-question-field";

export interface BulkQuiz {
  rulebookId: string;
  bookTitle: string;
  bookSub: string;
  question: string;
}

interface BulkQuizStepProps {
  quizzes: BulkQuiz[];
  totalBooks: number;
  answers: Record<string, string>;
  errors: Record<string, string>;
  onAnswerChange: (params: { rulebookId: string; answer: string }) => void;
}

export function BulkQuizStep({
  quizzes,
  totalBooks,
  answers,
  errors,
  onAnswerChange,
}: BulkQuizStepProps) {
  return (
    <VStack gap="200">
      <VStack gap="050">
        <Text typography="heading1" render={<h2 />}>
          본문 퀴즈
        </Text>
        <Text typography="body2" foreground="muted" render={<p />} className="break-keep">
          {`함께 신청한 ${totalBooks}권 중 ${quizzes.length}권만 묻습니다.`}
        </Text>
      </VStack>
      {quizzes.map((quiz) => (
        <QuizQuestionField
          key={quiz.rulebookId}
          inputId={bulkQuizAnswerField(quiz.rulebookId)}
          bookTitle={quiz.bookTitle}
          bookSub={quiz.bookSub}
          question={quiz.question}
          answer={answers[quiz.rulebookId] ?? ""}
          error={errors[quiz.rulebookId] ?? null}
          onAnswerChange={(answer) => onAnswerChange({ rulebookId: quiz.rulebookId, answer })}
        />
      ))}
    </VStack>
  );
}
