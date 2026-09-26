import { Callout, Field, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { BookOpen } from "lucide-react";

interface QuizStepProps {
  bookLabel: string;
  question: string;
  answer: string;
  error: string | null;
  onAnswerChange: (answer: string) => void;
}

const ANSWER_ID = "cert-quiz-answer";

// 신청 3단계. 책을 가진 사람이면 쉽게 답할 본문 퀴즈 한 문항.
export function QuizStep({ bookLabel, question, answer, error, onAnswerChange }: QuizStepProps) {
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
      <Callout.Root>
        <Callout.Description>
          <HStack align="center" gap="075" render={<span />}>
            <BookOpen size={16} strokeWidth={2.1} aria-hidden className="flex-none" />
            <Text typography="body3" weight="bold" foreground="inherit">
              {bookLabel}
            </Text>
          </HStack>
        </Callout.Description>
      </Callout.Root>
      <VStack gap="150" className="pt-100">
        <Text
          typography="subtitle1"
          render={<label htmlFor={ANSWER_ID} />}
          className="break-keep [text-wrap:pretty]"
        >
          {question}
        </Text>
        <Field.Root error={error ?? undefined}>
          <TextInput
            id={ANSWER_ID}
            maxLength={200}
            placeholder="답 입력"
            value={answer}
            invalid={Boolean(error)}
            onChange={(event) => onAnswerChange(event.target.value)}
          />
        </Field.Root>
      </VStack>
    </VStack>
  );
}
