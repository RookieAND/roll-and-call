import { Badge, Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface RoundsProgressCardProps {
  finishedCount: number;
  total: number;
  early: boolean;
  badges: readonly string[];
}

export function RoundsProgressCard({
  finishedCount,
  total,
  early,
  badges,
}: RoundsProgressCardProps) {
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="100">
        <HStack justify="between" align="center">
          <Text typography="heading3" weight="extrabold" render={<h2 />} className="tabular-nums">
            {finishedCount} / {total}회 마침
          </Text>
          {early && <Badge colorPalette="warning">일찍 마침</Badge>}
        </HStack>
        <Progress
          value={finishedCount}
          max={total}
          colorPalette={early ? "gray" : "primary"}
          aria-label="진행한 회차"
        />
        <HStack gap="075" wrap>
          {badges.map((badge) => (
            <Badge key={badge} colorPalette="gray">
              {badge}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </Card.Root>
  );
}
