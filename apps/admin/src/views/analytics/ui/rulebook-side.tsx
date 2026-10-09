import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

import type { AnalyticsData } from "@/shared/server";

type MethodShare = AnalyticsData["methodShare"]["open"];

const METHOD_SEGMENTS = [
  {
    key: "firstCome",
    label: "선착순",
    foreground: "onPrimary",
    className: "flex items-center bg-primary-600 pl-100",
    style: {},
  },
  {
    key: "lottery",
    label: "추첨",
    foreground: "normal",
    className: "flex items-center justify-end pr-100 text-heat-ink",
    style: { background: "var(--color-heat-2)" },
  },
  {
    key: "selection",
    label: "선발",
    foreground: "normal",
    className: "flex items-center justify-end pr-100 text-heat-ink-strong",
    style: { background: "var(--color-heat-4)" },
  },
] as const;

interface RulebookSideProps {
  title: string;
  rulebooks: { name: string; count: number }[];
  methodShare: MethodShare;
}

export function RulebookSide({ title, rulebooks, methodShare }: RulebookSideProps) {
  const max = Math.ceil(Math.max(1, ...rulebooks.map((rulebook) => rulebook.count)) / 10) * 10;
  return (
    <VStack gap="050">
      <Text typography="body4" weight="bold" foreground="muted" className="mb-050">
        {title}
      </Text>
      {rulebooks.map((rulebook) => (
        <HStack key={rulebook.name} align="center" gap="100" className="py-050">
          <Text typography="body4" truncate className="w-[118px] shrink-0">
            {rulebook.name}
          </Text>
          <Progress value={rulebook.count} max={max} className="flex-1" />
          <Text typography="body4" foreground="muted" numeric className="w-[44px] text-right">
            {rulebook.count}건
          </Text>
        </HStack>
      ))}
      <VStack className="mt-150 border-t border-(--rc-color-border-subtle) pt-150">
        <Text typography="body4" weight="bold" foreground="muted" className="mb-100">
          모집 방식 비율
        </Text>
        <HStack className="h-[22px] overflow-hidden rounded-200">
          {METHOD_SEGMENTS.map((segment) => (
            <Text
              key={segment.key}
              typography="body4"
              weight="bold"
              foreground={segment.foreground}
              className={segment.className}
              style={{ flexGrow: methodShare[segment.key], flexBasis: 0, ...segment.style }}
            >
              {methodShare[segment.key] > 0 ? `${methodShare[segment.key]}%` : null}
            </Text>
          ))}
        </HStack>
        <HStack justify="between" className="mt-050">
          {METHOD_SEGMENTS.map((segment) => (
            <Text key={segment.key} typography="body4" foreground="muted">
              {segment.label}
            </Text>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}
