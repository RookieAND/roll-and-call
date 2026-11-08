import { Callout, Field, Text, TextInput, VStack } from "@roll-and-call/ui";
import { BookOpen } from "lucide-react";

interface QuizQuestionFieldProps {
  inputId: string;
  bookTitle: string;
  bookSub: string;
  question: string;
  answer: string;
  error: string | null;
  onAnswerChange: (answer: string) => void;
}

export function QuizQuestionField({
  inputId,
  bookTitle,
  bookSub,
  question,
  answer,
  error,
  onAnswerChange,
}: QuizQuestionFieldProps) {
  return (
    <VStack gap="150">
      <Callout.Root>
        <Callout.Icon>
          <BookOpen size={14} strokeWidth={2.2} />
        </Callout.Icon>
        <Callout.Description>
          <Text typography="subtitle2" foreground="inherit">
            {bookTitle}
          </Text>
          <Text typography="body4" foreground="muted">
            {bookSub}
          </Text>
        </Callout.Description>
      </Callout.Root>
      <VStack gap="150" className="pt-100">
        <Text
          typography="body2"
          weight="bold"
          render={<label htmlFor={inputId} />}
          className="break-keep text-pretty"
        >
          {question}
        </Text>
        <Field.Root error={error ?? undefined}>
          <TextInput
            id={inputId}
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
