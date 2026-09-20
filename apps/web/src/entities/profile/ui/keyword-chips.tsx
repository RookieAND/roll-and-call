import { HStack, Text } from "@trpg/ui";

interface KeywordChipsProps {
  keywords: readonly string[];
}

// 지금은 누르지 않는다. 같은 성향으로 사람을 찾는 화면이 없고, 구인 태그와 섞이면 같은 모양이 둘을 뜻한다.
export function KeywordChips({ keywords }: KeywordChipsProps) {
  if (keywords.length === 0) {
    return (
      <HStack
        align="center"
        gap="100"
        className="min-h-11 rounded-400 border border-dashed border-gray-300 px-150"
      >
        <Text weight="bold" typography="body3" foreground="hint" className="flex-none">
          #
        </Text>
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1">
          적어둔 성향이 없습니다
        </Text>
      </HStack>
    );
  }

  return (
    <HStack gap="075" wrap>
      {keywords.map((keyword) => (
        <span
          key={keyword}
          className="flex h-8 items-center rounded-full border border-primary-200 bg-primary-50 px-150 text-subtitle2 font-bold text-primary-ink"
        >
          #{keyword}
        </span>
      ))}
    </HStack>
  );
}
