import { Card, Text } from "@roll-and-call/ui";

interface GmQuestionProps {
  question: string;
}

export function GmQuestion({ question }: GmQuestionProps) {
  return (
    <Card.Root padding="sm" radius={400} className="flex flex-col gap-050">
      <Text typography="body4" weight="bold" foreground="muted">
        GM의 질문
      </Text>
      <Text typography="body2" className="break-keep">
        {question}
      </Text>
    </Card.Root>
  );
}
