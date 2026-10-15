import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/entities/analytics";

import { MobileAnalyticsSection } from "./mobile-analytics-section";

const METHOD_SEGMENTS = [
  { key: "firstCome", label: "선착순", color: "var(--rc-color-bg-primary)" },
  { key: "lottery", label: "추첨", color: "var(--rc-color-heat-2)" },
  { key: "selection", label: "선발", color: "var(--rc-color-heat-4)" },
] as const;

interface MobileRulebookSectionProps {
  title: string;
  rulebooks: { name: string; count: number }[];
  methodShare: AnalyticsData["methodShare"]["open"];
}

// 룰북별 가로 막대와 모집 방식 비율 띠.
export function MobileRulebookSection({
  title,
  rulebooks,
  methodShare,
}: MobileRulebookSectionProps) {
  const max = Math.max(1, ...rulebooks.map((rulebook) => rulebook.count));
  const shares = METHOD_SEGMENTS.filter((segment) => methodShare[segment.key] > 0);
  return (
    <MobileAnalyticsSection title={title}>
      <VStack gap="075">
        {rulebooks.map((rulebook) => (
          <VStack key={rulebook.name} gap="050">
            <HStack justify="between" gap="100">
              <Text typography="body4" truncate className="min-w-0">
                {rulebook.name}
              </Text>
              <Text typography="body4" weight="bold" numeric>
                {rulebook.count}건
              </Text>
            </HStack>
            <Progress
              value={rulebook.count}
              max={max}
              aria-label={`${rulebook.name} ${rulebook.count}건`}
              className="h-2"
            />
          </VStack>
        ))}
      </VStack>
      <VStack gap="075" className="border-t border-(--rc-color-border-subtle) pt-150">
        <Text typography="body4" weight="bold">
          모집 방식 비율
        </Text>
        <HStack gap="025" className="h-[14px] overflow-hidden rounded-200">
          {shares.map((segment) => (
            <span
              key={segment.key}
              aria-hidden
              style={{ flex: methodShare[segment.key], background: segment.color }}
            />
          ))}
        </HStack>
        <HStack gap="200" wrap>
          {METHOD_SEGMENTS.map((segment) => (
            <HStack key={segment.key} align="center" gap="075">
              <span
                aria-hidden
                className="size-[10px] rounded-100"
                style={{ background: segment.color }}
              />
              <Text typography="body4">
                {segment.label}{" "}
                <Text typography="body4" weight="bold" numeric render={<b />}>
                  {methodShare[segment.key]}%
                </Text>
              </Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
    </MobileAnalyticsSection>
  );
}
