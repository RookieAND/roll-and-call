import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface QuestProgressProps {
  clearedCount: number;
  allCleared: boolean;
}

// 진행도 「n / 4」는 이 화면 한 곳에만 둔다. 모바일과 데스크톱이 같다.
export function QuestProgress({ clearedCount, allCleared }: QuestProgressProps) {
  const reward = allCleared
    ? "🧭 견습 모험가 업적을 받았습니다."
    : "모두 깨면 🧭 견습 모험가 업적을 받습니다.";
  return (
    <VStack gap="100">
      <HStack align="center" gap="150">
        <Progress
          value={clearedCount}
          max={ONBOARDING_QUESTS.length}
          colorPalette="primary"
          aria-label="클리어 진행"
          className="h-1.5 flex-1"
        />
        <Text typography="subtitle2" foreground="muted" numeric>
          {clearedCount} / {ONBOARDING_QUESTS.length}
        </Text>
      </HStack>
      <Text typography="body4" foreground="hint">
        {reward}
      </Text>
    </VStack>
  );
}
