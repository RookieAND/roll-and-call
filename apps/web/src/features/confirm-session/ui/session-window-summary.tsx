import { Card, Text } from "@roll-and-call/ui";

interface SessionWindowSummaryProps {
  windowLabel: string;
}

export function SessionWindowSummary({ windowLabel }: SessionWindowSummaryProps) {
  return (
    <Card.Root background="subtle" padding="sm" radius={500}>
      <Text numeric typography="body3" weight="bold" render={<span />}>
        {windowLabel}
      </Text>
    </Card.Root>
  );
}
