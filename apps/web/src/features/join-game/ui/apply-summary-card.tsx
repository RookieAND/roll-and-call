import { Card, Text, VStack } from "@roll-and-call/ui";

interface ApplySummaryCardProps {
  lines: string[];
  onClick: () => void;
}

// 누르면 회차 일정 시트가 열린다.
export function ApplySummaryCard({ lines, onClick }: ApplySummaryCardProps) {
  const [title, ...details] = lines;

  return (
    <Card.Root
      padding="md"
      radius={500}
      interactive
      render={<button type="button" onClick={onClick} />}
      className="w-full cursor-pointer text-left"
    >
      <VStack gap="050" render={<span />}>
        <Text typography="subtitle2">{title}</Text>
        {details.map((line) => (
          <Text key={line} typography="body3" foreground="muted">
            {line}
          </Text>
        ))}
      </VStack>
    </Card.Root>
  );
}
