import { Card, Text } from "@roll-and-call/ui";

interface ConfirmSummaryProps {
  playLabel: string;
}

export function ConfirmSummary({ playLabel }: ConfirmSummaryProps) {
  return (
    <Card.Root radius={500} padding="sm" className="flex flex-col gap-050">
      <Text typography="body4" foreground="hint" render={<p />}>
        플레이타임
      </Text>
      <Text numeric typography="heading2" render={<p />}>
        {playLabel}
      </Text>
    </Card.Root>
  );
}
