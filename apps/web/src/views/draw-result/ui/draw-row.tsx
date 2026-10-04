import { Avatar, Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { isNull } from "es-toolkit";

import { EMPTY_BIO_TEXT } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

import type { DrawEntry } from "../model/draw-entry";
import { toRollGrade } from "../model/roll-grade";
import { DrawRollText } from "./draw-roll-text";

const row = cva(
  "min-h-14 border-t border-gray-200 py-100 pl-175 transition-colors first:border-t-0 hover:bg-gray-50",
  {
    variants: {
      isMe: { true: "bg-gray-50", false: "" },
      // 대성공·극단적 성공 칩은 별이 바깥으로 삐져나와서 오른쪽을 덜 비운다.
      graded: { true: "pr-125", false: "pr-175" },
    },
  },
);

interface DrawRowProps {
  entry: DrawEntry;
  isMe: boolean;
}

export function DrawRow({ entry, isMe }: DrawRowProps) {
  const nameWeight = isMe ? "bold" : "medium";

  return (
    <HStack
      align="center"
      gap="125"
      render={<ServerLink path={`/users/${entry.userId}`} />}
      className={row({ isMe, graded: !isNull(toRollGrade(entry.roll)) })}
    >
      <Avatar src={entry.avatarUrl} name={entry.username} size="md" />
      <VStack className="min-w-0 flex-1">
        <Text truncate typography="body3" weight={nameWeight}>
          {entry.username}
        </Text>
        <Text truncate typography="body4" foreground="hint" render={<div />}>
          {entry.bio || EMPTY_BIO_TEXT}
        </Text>
      </VStack>
      {isMe && <Badge colorPalette="primary">나</Badge>}
      <DrawRollText roll={entry.roll} isMe={isMe} />
    </HStack>
  );
}
