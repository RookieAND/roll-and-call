import { Card, Text } from "@roll-and-call/ui";

import { memberCountTone } from "../model/member-count-tone";
import { SummaryRow } from "./summary-row";

interface SessionWindowSummaryProps {
  windowLabel: string;
  memberCount: number;
  respondentCount: number;
  everyone: boolean;
}

export function SessionWindowSummary({
  windowLabel,
  memberCount,
  respondentCount,
  everyone,
}: SessionWindowSummaryProps) {
  const memberTone = memberCountTone({ respondentCount, everyone });

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
        <Text numeric typography="subtitle2" foreground={memberTone} render={<span />}>
          {memberCount}명
        </Text>
      </SummaryRow>
    </Card.Root>
  );
}
