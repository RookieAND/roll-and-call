import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface DetailAsideProps {
  children: ReactNode;
}

export function DetailAside({ children }: DetailAsideProps) {
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-75 shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
    >
      {children}
    </VStack>
  );
}
