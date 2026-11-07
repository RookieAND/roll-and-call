import { Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BADGE_TAB } from "@/entities/badge";
import { ServerLink } from "@/shared/ui";

interface QuestAchievementPreviewProps {
  earned: boolean;
  // 받기 전 설명. 없으면 받은 뒤와 같은 문구를 흐리게 보인다(모바일).
  lockedCaption?: string;
}

// 받기 전에는 흐린 점선 윤곽, 받은 뒤에는 업적 도감의 특별 탭으로 가는 [업적 보기]가 붙는다.
export function QuestAchievementPreview({ earned, lockedCaption }: QuestAchievementPreviewProps) {
  const caption = !earned && lockedCaption ? lockedCaption : "튜토리얼 퀘스트를 모두 마쳤습니다.";
  return (
    <VStack
      gap="150"
      className={cn(
        "rounded-600 p-200",
        earned
          ? "border border-gray-200 bg-gray-50"
          : "border-[1.5px] border-dashed border-gray-300 opacity-60",
      )}
    >
      <HStack align="center" gap="150">
        <span
          aria-hidden
          className="flex size-8 flex-none items-center justify-center rounded-400 bg-gray-100 text-lg"
        >
          🧭
        </span>
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1" weight="extrabold">
            견습 모험가
          </Text>
          <Text typography="body3" foreground="muted">
            {caption}
          </Text>
        </VStack>
      </HStack>
      {earned && (
        <Button
          variant="outline"
          colorPalette="gray"
          size="md"
          className="min-h-11 w-full"
          render={<ServerLink path={`/me/badges?tab=${BADGE_TAB.special}`} />}
        >
          업적 보기
        </Button>
      )}
    </VStack>
  );
}
