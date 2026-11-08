import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface EntrySheetProps {
  children: ReactNode;
}

export function EntrySheet({ children }: EntrySheetProps) {
  return (
    <VStack
      gap="250"
      className="relative flex-none rounded-t-800 bg-surface px-300 pt-400 pb-[calc(var(--spacing-300)+var(--rc-safe-bottom))] shadow-sheet desktop:mx-auto desktop:w-full desktop:max-w-160"
    >
      {children}
    </VStack>
  );
}
