import { HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import type { UserRow } from "@/shared/server";
import { Tag } from "@/shared/ui";

import { userStateCellText } from "../model/user-state-cell-text";

interface UserStateCellProps {
  row: UserRow;
}

export function UserStateCell({ row }: UserStateCellProps) {
  const { badge, text } = userStateCellText(row);
  if (isNull(badge)) {
    return (
      <Text typography="body3" foreground="hint">
        {text}
      </Text>
    );
  }
  return (
    <HStack align="center" gap="075">
      <Tag>{badge}</Tag>
      <Text typography="body3" foreground="danger" truncate>
        {text}
      </Text>
    </HStack>
  );
}
