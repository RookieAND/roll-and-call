import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface RulebookSideProps {
  title: string;
  rulebooks: { name: string; count: number }[];
  firstComeShare: number;
}

export function RulebookSide({ title, rulebooks, firstComeShare }: RulebookSideProps) {
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
          <Text
            typography="body4"
            weight="bold"
            foreground="onPrimary"
            className="flex items-center bg-primary-600 pl-100"
            style={{ width: `${firstComeShare}%` }}
          >
            {firstComeShare}%
          </Text>
          <Text
            typography="body4"
            weight="bold"
            className="flex flex-1 items-center justify-end pr-100 text-heat-ink"
            style={{ background: "var(--color-heat-2)" }}
          >
            {100 - firstComeShare}%
          </Text>
        </HStack>
        <HStack justify="between" className="mt-050">
          <Text typography="body4" foreground="muted">
            선착순
          </Text>
          <Text typography="body4" foreground="muted">
            추첨
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
