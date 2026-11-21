import { Card, cn, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { PROFILE_TINT_FILL, PROFILE_TINT_TEXT } from "../model/profile-tint";

const chip = cva("inline-flex flex-none items-center rounded-full whitespace-nowrap", {
  variants: {
    size: {
      sm: "h-5.5 px-075 text-body5 font-bold",
      md: "h-7 px-100 text-body4 font-bold",
      lg: "h-[30px] px-150",
    },
  },
});

const CHIP_GAP = { sm: "050", md: "075", lg: "075" } as const;

interface KeywordChipsProps {
  keywords: readonly string[];
  size?: "sm" | "md" | "lg";
  // 비었을 때 아무것도 그리지 않는다. 작은 크기(sm·md)는 끄면 같은 높이의 점선 칩으로 비었다고 보인다.
  hideEmpty?: boolean;
  className?: string;
}

// 칩 색은 기본 primary다.
export function KeywordChips({
  keywords,
  size = "lg",
  hideEmpty = false,
  className,
}: KeywordChipsProps) {
  if (keywords.length === 0) {
    if (hideEmpty) return null;
    if (size !== "lg") {
      return (
        <HStack className={className}>
          <Text
            foreground="hint"
            render={<span />}
            className={cn(chip({ size }), "border border-dashed border-gray-300 font-medium")}
          >
            # 적어둔 성향이 없습니다
          </Text>
        </HStack>
      );
    }
    return (
      <Card.Root
        padding="none"
        radius={400}
        className="flex min-h-11 items-center gap-100 border-dashed border-gray-300 px-150"
      >
        <Text weight="bold" typography="body3" foreground="hint" className="flex-none">
          #
        </Text>
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1">
          적어둔 성향이 없습니다
        </Text>
      </Card.Root>
    );
  }

  return (
    <HStack gap={CHIP_GAP[size]} wrap className={className}>
      {keywords.map((keyword) => (
        <Text
          key={keyword}
          typography={size === "lg" ? "subtitle2" : undefined}
          render={<span />}
          className={cn(chip({ size }), PROFILE_TINT_FILL, PROFILE_TINT_TEXT)}
        >
          #{keyword}
        </Text>
      ))}
    </HStack>
  );
}
