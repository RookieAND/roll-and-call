import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface QuestProgressPanelProps {
  clearedCount: number;
  allCleared: boolean;
}

// 1100px 이상에서만 보이는 진행 패널. 진행도는 한 화면 한 곳에만 두므로 앱바의 n / 4는 이 폭에서 숨긴다.
export function QuestProgressPanel({ clearedCount, allCleared }: QuestProgressPanelProps) {
  return (
    <VStack
      render={<section aria-label="진행 상황" />}
      gap="175"
      className="rounded-700 border border-gray-200 bg-surface p-250"
    >
      <Text typography="subtitle2" foreground="muted">
        진행 상황
      </Text>
      <HStack align="baseline" gap="075">
        <Text typography="stat" numeric>
          {clearedCount}
        </Text>
        <Text typography="body2" weight="bold" foreground="muted">
          / 4 클리어
        </Text>
      </HStack>
      <Progress value={clearedCount} max={4} aria-label="클리어 진행" />
      <Text typography="body4" foreground="muted">
        {allCleared
          ? "🧭 견습 모험가 업적을 받았습니다."
          : "모두 깨면 🧭 견습 모험가 업적을 받습니다."}
      </Text>
    </VStack>
  );
}
