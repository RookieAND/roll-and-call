import { Text } from "@roll-and-call/ui";

import { GMS_NEEDED } from "@/shared/server";

import { AnalyticsSection } from "./analytics-section";

export function GmFewNotice() {
  return (
    <AnalyticsSection title="GM 분포" sub="진행된 세션 기준">
      <Text typography="body3" foreground="hint">
        GM 분포는 기간 안에 GM {GMS_NEEDED}명 이상이 세션을 진행하면 보입니다.
      </Text>
    </AnalyticsSection>
  );
}
