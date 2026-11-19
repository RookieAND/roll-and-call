"use client";

import { Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface FoldedReviewGroupsProps {
  count: number;
  children: ReactNode;
}

// 회차 묶음이 많을 때 지난 묶음을 접는다.
export function FoldedReviewGroups({ count, children }: FoldedReviewGroupsProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger className="group block w-full cursor-pointer py-100 text-left">
        <HStack align="center" gap="075">
          <Text typography="body3" foreground="muted" className="flex-1">
            지난 회차 후기 {count}개
          </Text>
          <ChevronDown
            size={18}
            aria-hidden
            className="flex-none text-hint transition-transform group-data-panel-open:rotate-180"
          />
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <VStack gap="250" className="pt-150">
          {children}
        </VStack>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
