import { Badge, HStack, Text } from "@roll-and-call/ui";
import { Fragment } from "react";

import type { CategoryEdition } from "@/shared/server";

interface GmConditionProps {
  edition: CategoryEdition;
}

export function GmCondition({ edition }: GmConditionProps) {
  if (edition.free) {
    return (
      <Text typography="body4" foreground="hint">
        인증 없이 GM이 될 수 있습니다
      </Text>
    );
  }
  if (edition.required.length === 0) {
    return (
      <Text typography="body4" foreground="hint">
        이 판본에는 기본 룰북이 없습니다
      </Text>
    );
  }
  return (
    <HStack align="center" gap="075" wrap>
      {edition.required.map((book, index) => (
        <Fragment key={book.id}>
          {index > 0 ? (
            <Text typography="body4" foreground="hint">
              +
            </Text>
          ) : null}
          <Badge colorPalette="primary">{book.label}</Badge>
        </Fragment>
      ))}
      {edition.alternatives.map((book) => (
        <Fragment key={book.id}>
          <Text typography="body4" foreground="hint">
            또는
          </Text>
          <Badge colorPalette="primary">{book.label}</Badge>
        </Fragment>
      ))}
    </HStack>
  );
}
