import { Card, Text } from "@roll-and-call/ui";

interface SessionWindowSummaryProps {
  windowLabel: string;
}

export function SessionWindowSummary({ windowLabel }: SessionWindowSummaryProps) {
  return (
    <Card.Root background="subtle" padding="none" radius={500}>
      <div className="flex min-h-10 items-center px-175">
        <Text typography="body4" foreground="hint" className="flex-1">
          세션 시간
        </Text>
        <Text numeric typography="body3" weight="bold">
          {windowLabel}
        </Text>
      </div>
    </Card.Root>
  );
}
