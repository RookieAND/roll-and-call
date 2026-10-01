import { Chip, HStack, Text } from "@roll-and-call/ui";

interface KeywordChipsProps {
  keywords: readonly string[];
}

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
        <Chip key={keyword} shape="pill" selected render={<span />}>
          #{keyword}
        </Chip>
      ))}
    </HStack>
  );
}
