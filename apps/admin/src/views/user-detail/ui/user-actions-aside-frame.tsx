import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface UserActionsAsideFrameProps {
  children: ReactNode;
}

export function UserActionsAsideFrame({ children }: UserActionsAsideFrameProps) {
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[288px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
    >
      <Text
        typography="heading3"
        render={<h2 />}
        className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        조치
      </Text>
      {children}
    </VStack>
  );
}
