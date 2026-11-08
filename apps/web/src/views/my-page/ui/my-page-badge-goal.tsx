import { Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface MyPageBadgeGoalProps {
  emoji: string;
  title: string;
  count: number;
  threshold: number;
  condition: string;
  progressLabel: string;
}

export function MyPageBadgeGoal({
  emoji,
  title,
  count,
  threshold,
  condition,
  progressLabel,
}: MyPageBadgeGoalProps) {
  return (
    <HStack align="center" gap="150" className="p-175">
      <Card.Root
        padding="none"
        radius={600}
        className="flex size-12 flex-none items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-canvas"
      >
        <Text
          typography="heading1"
          foreground="inherit"
          aria-hidden
          className="leading-none opacity-45 grayscale"
        >
          {emoji}
        </Text>
      </Card.Root>
      <VStack gap="075" className="min-w-0 flex-1">
        <HStack align="baseline" gap="075">
          <Text typography="body2" weight="extrabold" className="min-w-0 flex-1 break-keep">
            {title}
          </Text>
          <Text typography="body4" foreground="hint" className="tabular-nums">
            {count} / {threshold}
          </Text>
        </HStack>
        <Progress value={count} max={threshold} colorPalette="primary" aria-label={progressLabel} />
        <Text typography="body4" foreground="muted" className="break-keep">
          <LineBreaks lines={condition.split("\n")} />
        </Text>
      </VStack>
    </HStack>
  );
}
