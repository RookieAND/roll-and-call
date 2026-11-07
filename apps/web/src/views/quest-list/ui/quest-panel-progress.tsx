import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Card, HStack, Progress, Text } from "@roll-and-call/ui";

interface QuestPanelProgressProps {
  clearedCount: number;
}

export function QuestPanelProgress({ clearedCount }: QuestPanelProgressProps) {
  return (
    <Card.Root padding="md" radius={600} render={<section aria-label="진행 상황" />}>
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
        className="mt-150 h-1.5"
      />
    </Card.Root>
  );
}
