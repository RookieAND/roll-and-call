import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { Facts, type Fact } from "./facts";

interface EntityHeadProps {
  title: string;
  lead: ReactNode;
  badges?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  facts?: Fact[];
  columns?: 3 | 4;
  actions?: ReactNode;
}

// 유저·세션·룰북 요약은 모두 이 모양 하나로 보여 준다.
export function EntityHead({
  title,
  lead,
  badges,
  meta,
  description,
  facts,
  columns,
  actions,
}: EntityHeadProps) {
  return (
    <VStack
      gap="150"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface px-200 py-175"
    >
      <HStack align="center" gap="150">
        {lead}
        <VStack gap="025" className="min-w-0 flex-1">
          <HStack align="center" gap="100" wrap>
            <Text typography="heading3" render={<h2 />}>
              {title}
            </Text>
            {badges}
          </HStack>
          {meta ? (
            <Text typography="body4" foreground="hint">
              {meta}
            </Text>
          ) : null}
          {description}
        </VStack>
        {actions ? (
          <HStack gap="075" className="shrink-0">
            {actions}
          </HStack>
        ) : null}
      </HStack>
      {facts ? (
        <div className="border-t border-(--rc-color-border-subtle) pt-150">
          <Facts items={facts} columns={columns} />
        </div>
      ) : null}
    </VStack>
  );
}
