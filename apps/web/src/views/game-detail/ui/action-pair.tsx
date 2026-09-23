import { HStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ActionPairProps {
  children: ReactNode;
}

export function ActionPair({ children }: ActionPairProps) {
  return (
    <HStack gap="100" className="[&>*]:min-w-0 [&>*]:flex-1">
      {children}
    </HStack>
  );
}
