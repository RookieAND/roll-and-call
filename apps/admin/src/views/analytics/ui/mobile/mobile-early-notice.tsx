import { Callout, Progress, Text, VStack } from "@roll-and-call/ui";

import { GMS_NEEDED, PEOPLE_WEEKS_NEEDED, type AnalyticsData } from "@/entities/analytics";

import { MobileAnalyticsSection } from "./mobile-analytics-section";

interface MobileEarlyNoticeProps {
  serviceWeeks: number;
  hostingGms: number;
  sections: AnalyticsData["sections"];
}

// 기록이 부족한 초기에는 지표 대신 진행 정도만 보인다.
export function MobileEarlyNotice({ serviceWeeks, hostingGms, sections }: MobileEarlyNoticeProps) {
  const pending = [
    {
      open: sections.people,
      title: "참여자 추이",
      condition: `${PEOPLE_WEEKS_NEEDED}주치 기록이 모이면`,
      value: serviceWeeks,
      max: PEOPLE_WEEKS_NEEDED,
      unit: "주",
    },
    {
      open: sections.gms,
      title: "GM 분포",
      condition: `GM ${GMS_NEEDED}명 이상이 세션을 진행하면`,
      value: hostingGms,
      max: GMS_NEEDED,
      unit: "명",
    },
  ].filter((item) => !item.open);
  return (
    <>
      <Callout.Root>
        <Callout.Icon />
        <Callout.Title>데이터가 더 쌓이면 보입니다</Callout.Title>
        <Callout.Description>
          서비스를 시작한 지 {serviceWeeks}주가 지났습니다. 아래 지표는 비교할 만큼 기록이 모이면 이
          자리에 나타납니다.
        </Callout.Description>
      </Callout.Root>
      {pending.map((item) => (
        <MobileAnalyticsSection key={item.title} title={item.title}>
          <VStack gap="100">
            <Text typography="body3" foreground="muted">
              {item.condition}
            </Text>
            <Progress
              value={item.value}
              max={item.max}
              aria-label={`${item.title} ${item.value} / ${item.max}${item.unit}`}
              className="h-2"
            />
            <Text typography="body3" weight="bold" numeric>
              {item.value} / {item.max}
              {item.unit}
            </Text>
          </VStack>
        </MobileAnalyticsSection>
      ))}
    </>
  );
}
