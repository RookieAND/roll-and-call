import { HStack } from "@trpg/ui";
import type { ReactNode } from "react";

interface ActionPairProps {
  children: ReactNode;
}

export function ActionPair({ children }: ActionPairProps) {
  return (
    <HStack gap="100" className="[&>*]:flex-1">
      {children}
    </HStack>
  );
}
