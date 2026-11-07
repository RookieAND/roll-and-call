import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

interface QuestAchievementPreviewProps {
  earned: boolean;
}

export function QuestAchievementPreview({ earned }: QuestAchievementPreviewProps) {
  return (
    <HStack
      align="center"
      gap="150"
      className={cn(
        "mt-050 rounded-600 p-200",
        earned
          ? "border border-gray-200 bg-gray-50"
          : "border-[1.5px] border-dashed border-gray-300 opacity-60",
      )}
    >
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
          튜토리얼 퀘스트를 모두 마쳤습니다.
        </Text>
      </VStack>
    </HStack>
  );
}
