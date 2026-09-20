import { Text } from "@trpg/ui";

import { SummaryRow } from "./summary-row";

export function SessionWindowSummary({
  windowLabel,
  memberCount,
  everyone,
}: {
  windowLabel: string;
  memberCount: number;
  everyone: boolean;
}) {
  return (
    <>
      <SummaryRow label="세션 시간">
        <Text numeric typography="heading3" weight="extrabold" render={<span />}>
          {windowLabel}
        </Text>
      </SummaryRow>
      <SummaryRow label="가능 인원">
        <Text
          numeric
          typography="heading3"
          weight="extrabold"
          foreground={everyone ? "normal" : "warning"}
          render={<span />}
        >
          {memberCount}명
        </Text>
      </SummaryRow>
    </>
  );
}
