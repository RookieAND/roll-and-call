import { Text, VStack } from "@roll-and-call/ui";

interface GmQuestionProps {
  question: string;
}

export function GmQuestion({ question }: GmQuestionProps) {
  return (
    <VStack gap="050" className="rounded-400 bg-secondary px-150 py-125">
      <Text typography="body4" foreground="muted" weight="bold">
        GM의 질문
      </Text>
      <Text typography="body3" className="break-keep">
        {question}
      </Text>
    </VStack>
  );
}
