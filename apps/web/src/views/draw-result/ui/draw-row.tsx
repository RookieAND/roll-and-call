import { Avatar, Badge, HStack, Text, VStack } from "@trpg/ui";
import { cva } from "class-variance-authority";

import type { DrawEntry } from "../model/draw-entry";
import { DRAW_ROW_VARIANT, type DrawRowVariant } from "../model/draw-row-variant";
import { toRollGrade } from "../model/roll-grade";
import { DrawRollText } from "./draw-roll-text";

const row = cva("border-t pl-175 first:border-t-0", {
  variants: {
    variant: {
      highlight: "min-h-16 border-primary-50 py-100",
      plain: "min-h-[60px] border-gray-100 py-100",
      compact: "min-h-14 border-gray-100 py-075",
    },
    isMe: { true: "bg-gray-50", false: "" },
    // 대성공·극단적 성공 칩은 별이 바깥으로 삐져나와서 오른쪽을 덜 비운다.
    graded: { true: "pr-125", false: "pr-175" },
  },
});

const avatarSize = {
  highlight: "",
  plain: "h-7 w-7",
  compact: "h-[26px] w-[26px]",
} as const satisfies Record<DrawRowVariant, string>;

interface DrawRowProps {
  entry: DrawEntry;
  variant: DrawRowVariant;
  isMe: boolean;
}

export function DrawRow({ entry, variant, isMe }: DrawRowProps) {
  const highlight = variant === DRAW_ROW_VARIANT.highlight;
  const strong = highlight || isMe;

  let rollText = (
    <Text typography="body4" foreground="hint">
      직접 확정
    </Text>
  );
  if (entry.roll !== null) {
    let rollTypography: "heading2" | "heading3" = "heading3";
    if (highlight || (variant === DRAW_ROW_VARIANT.compact && isMe)) rollTypography = "heading2";
    rollText = (
      <DrawRollText
        value={entry.roll}
        typography={rollTypography}
        foreground={strong ? "normal" : "muted"}
      />
    );
  }

  return (
    <HStack
      align="center"
      gap="125"
      className={row({ variant, isMe, graded: toRollGrade(entry.roll) !== null })}
    >
      <Avatar
        src={entry.avatarUrl}
        name={entry.username}
        size={highlight ? "md" : "sm"}
        className={avatarSize[variant]}
      />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text
          typography={highlight ? "body2" : "body3"}
          weight={strong ? "bold" : "medium"}
          truncate
          className={strong ? "leading-[1.35]" : "leading-[1.35] text-gray-700"}
        >
          {entry.username}
        </Text>
        <Text typography="body4" foreground="hint" truncate className="leading-[1.35]">
          {entry.bio || "한 줄 소개가 없습니다"}
        </Text>
      </VStack>
      {isMe && <Badge color="primary">나</Badge>}
      {rollText}
    </HStack>
  );
}
