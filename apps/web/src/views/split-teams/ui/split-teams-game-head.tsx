import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

interface SplitTeamsGameHeadProps {
  title: string;
  // 「대기 8명」, 판정 전이면 「신청 5명」
  countLabel: string;
  // 「CoC 7th · 정원 4명 · 확정 4명」
  line: string;
}

export function SplitTeamsGameHead({ title, countLabel, line }: SplitTeamsGameHeadProps) {
  return (
    <Card.Root radius={500} padding="md">
      <VStack gap="075">
        <HStack align="center" gap="100">
          <Text typography="heading3" weight="extrabold" truncate className="min-w-0 flex-1">
            {title}
          </Text>
          <Badge colorPalette="primary">{countLabel}</Badge>
        </HStack>
        <Text typography="body4" foreground="muted" render={<p />}>
          {line}
        </Text>
      </VStack>
    </Card.Root>
  );
}
