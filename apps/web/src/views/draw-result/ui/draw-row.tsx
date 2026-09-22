import { Badge, HStack } from "@trpg/ui";
import { cva } from "class-variance-authority";
import Link from "next/link";

import { EMPTY_BIO_TEXT, ProfileRow } from "@/entities/profile";

import type { DrawEntry } from "../model/draw-entry";
import { DRAW_ROW_VARIANT, type DrawRowVariant } from "../model/draw-row-variant";
import { toRollGrade } from "../model/roll-grade";
import { DrawRollText } from "./draw-roll-text";

const row = cva("border-t pl-175 transition-colors first:border-t-0 hover:bg-gray-50", {
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

interface DrawRowProps {
  entry: DrawEntry;
  variant: DrawRowVariant;
  isMe: boolean;
}

export function DrawRow({ entry, variant, isMe }: DrawRowProps) {
  const profileSize = variant === DRAW_ROW_VARIANT.highlight ? "md" : "sm";

  return (
    <HStack
      align="center"
      gap="125"
      render={<Link href={`/u/${entry.userId}`} />}
      className={row({ variant, isMe, graded: toRollGrade(entry.roll) !== null })}
    >
      <ProfileRow
        size={profileSize}
        name={entry.username}
        avatarUrl={entry.avatarUrl}
        subline={entry.bio || EMPTY_BIO_TEXT}
        sublineForeground="hint"
      />
      {isMe && <Badge color="primary">나</Badge>}
      <DrawRollText roll={entry.roll} variant={variant} isMe={isMe} />
    </HStack>
  );
}
