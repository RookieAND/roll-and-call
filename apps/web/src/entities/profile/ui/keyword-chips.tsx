import { cn, HStack, Text } from "@roll-and-call/ui";

import { ACCENT_TINT_FILL, ACCENT_TINT_TEXT } from "../model/accent-tint";

interface KeywordChipsProps {
  keywords: readonly string[];
}

// 칩 색은 프로필의 강조색(--acc)을 따른다. AccentScope 밖이면 기본 primary다.
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
        <Text
          key={keyword}
          typography="body3"
          weight="bold"
          render={<span />}
          className={cn(
            "inline-flex h-[30px] flex-none items-center rounded-full px-150 whitespace-nowrap",
            ACCENT_TINT_FILL,
            ACCENT_TINT_TEXT,
          )}
        >
          #{keyword}
        </Text>
      ))}
    </HStack>
  );
}
