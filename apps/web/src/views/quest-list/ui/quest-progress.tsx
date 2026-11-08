import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Button, Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

import { BADGE_TAB } from "@/entities/badge";
import { ServerLink } from "@/shared/ui";

interface QuestProgressProps {
  clearedCount: number;
  allCleared: boolean;
}

// 진행도 「n / 4」는 이 화면 한 곳에만 둔다. 업적을 받은 뒤에는 안내 줄 대신 업적 카드가 선다.
export function QuestProgress({ clearedCount, allCleared }: QuestProgressProps) {
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="075">
        <HStack align="center" gap="100">
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
        {allCleared ? (
          <VStack align="center" gap="100">
            <Text typography="heading1" aria-hidden>
              🧭
            </Text>
            <Text typography="heading2">견습 모험가</Text>
            <Text typography="body3" foreground="muted">
              튜토리얼 퀘스트를 모두 마쳤습니다.
            </Text>
            <Button
              variant="outline"
              colorPalette="gray"
              size="md"
              className="min-h-11 w-full"
              render={<ServerLink path={`/me/badges?tab=${BADGE_TAB.special}`} />}
            >
              업적 보기
            </Button>
          </VStack>
        ) : (
          <Text typography="body4" foreground="hint">
            모두 깨면 🧭 견습 모험가 업적을 받습니다.
          </Text>
        )}
      </VStack>
    </Card.Root>
  );
}
