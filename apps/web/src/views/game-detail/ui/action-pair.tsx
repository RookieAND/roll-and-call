import { HStack } from "@trpg/ui";
import type { ReactNode } from "react";

export function ActionPair({ children }: { children: ReactNode }) {
  return (
    <HStack gap="100" className="[&>*]:flex-1">
      {children}
    </HStack>
  );
}
