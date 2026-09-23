import { Card, Text } from "@roll-and-call/ui";

import { SummaryRow } from "./summary-row";

interface SessionWindowSummaryProps {
  windowLabel: string;
  memberCount: number;
  everyone: boolean;
}

export function SessionWindowSummary({
  windowLabel,
  memberCount,
  everyone,
}: SessionWindowSummaryProps) {
  return (
    <Card.Root
      background="subtle"
      padding="none"
      radius={500}
      className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
    >
      <SummaryRow label="세션 시간">
        <Text numeric typography="body3" weight="bold" render={<span />}>
          {windowLabel}
        </Text>
      </SummaryRow>
      <SummaryRow label="가능 인원">
        <Text
          numeric
          typography="subtitle2"
          foreground={everyone ? "success" : "warning"}
          render={<span />}
        >
          {memberCount}명
        </Text>
      </SummaryRow>
    </Card.Root>
  );
}
