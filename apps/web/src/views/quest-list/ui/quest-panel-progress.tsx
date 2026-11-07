import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface QuestPanelProgressProps {
  clearedCount: number;
}

export function QuestPanelProgress({ clearedCount }: QuestPanelProgressProps) {
  return (
    <Card.Root padding="md" radius={600} render={<section />}>
      <VStack gap="150">
        <Text typography="heading3" render={<h2 />}>
          진행 상황
        </Text>
        <HStack align="baseline" gap="075">
          <Text typography="stat" numeric>
            {clearedCount}
          </Text>
          <Text typography="body2" weight="bold" foreground="muted">
            / {ONBOARDING_QUESTS.length} 클리어
          </Text>
        </HStack>
        <Progress
          value={clearedCount}
          max={ONBOARDING_QUESTS.length}
          colorPalette="primary"
          aria-label="클리어 진행"
          className="h-1.5"
        />
      </VStack>
    </Card.Root>
  );
}
