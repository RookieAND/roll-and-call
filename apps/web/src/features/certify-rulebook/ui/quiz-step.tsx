import { Text, VStack } from "@roll-and-call/ui";

import { QuizQuestionField } from "./quiz-question-field";

interface QuizStepProps {
  bookTitle: string;
  bookSub: string;
  question: string;
  answer: string;
  error: string | null;
  onAnswerChange: (answer: string) => void;
}

const ANSWER_ID = "cert-quiz-answer";

export function QuizStep({
  bookTitle,
  bookSub,
  question,
  answer,
  error,
  onAnswerChange,
}: QuizStepProps) {
  return (
    <VStack gap="200">
      <VStack gap="050">
        <Text typography="heading1" render={<h2 />}>
          본문 퀴즈
        </Text>
        <Text typography="body2" foreground="muted" render={<p />} className="break-keep">
          책을 가지고 있다면 쉽게 답할 수 있는 질문입니다.
        </Text>
      </VStack>
      <QuizQuestionField
        inputId={ANSWER_ID}
        bookTitle={bookTitle}
        bookSub={bookSub}
        question={question}
        answer={answer}
        error={error}
        onAnswerChange={onAnswerChange}
      />
    </VStack>
  );
}
