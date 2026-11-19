import { Badge, Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface RoundsProgressCardProps {
  title: string;
  finishedCount: number;
  total: number;
  early: boolean;
  badges: readonly string[];
}

// 위는 세션 이름과 오른쪽 진행 방식, 그 아래 기간 안내, 맨 아래 진행 막대다.
export function RoundsProgressCard({
  title,
  finishedCount,
  total,
  early,
  badges,
}: RoundsProgressCardProps) {
  const [kind, ...notes] = badges;
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="100">
        <HStack justify="between" align="center" gap="100">
          <Text
            typography="heading3"
            weight="extrabold"
            render={<h2 />}
            className="min-w-0 flex-1 truncate"
          >
            {title}
          </Text>
          {kind && (
            <Badge colorPalette="gray" className="flex-none">
              {kind}
            </Badge>
          )}
        </HStack>
        {notes.length > 0 && (
          <Text typography="body4" foreground="muted">
            {notes.join(" · ")}
          </Text>
        )}
        <VStack gap="075">
          <HStack justify="between" align="center">
            <Text typography="body4" foreground="muted" className="tabular-nums">
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
        </VStack>
      </VStack>
    </Card.Root>
  );
}
